#!/usr/bin/env python3
"""
Gera as fontes do site em src/assets/fonts/ a partir dos arquivos do @fontsource-variable
(em node_modules), mantendo só o que o design usa:

  - DM Sans (subconjuntos latin e latin-ext): o eixo opsz continua inteiro (9-40, usado
    nos tamanhos de display) e o eixo wght fica limitado a 400-600, os pesos usados no CSS
    (--fw-regular, --fw-medium, --fw-semibold).
  - Red Hat Mono (latin e latin-ext): instância estática no peso 500, o único usado.

Cada arquivo mantém todos os glifos do subconjunto do fontsource e todas as features
OpenType (kern, liga, calt, frac...), então a cobertura de caracteres não muda. O
fontsource só publica os subconjuntos latin e latin-ext dessas duas famílias; nenhum foi
descartado. As regras @font-face (com os mesmos unicode-range) ficam em src/styles/fonts.css
e precisam declarar o mesmo font-weight em todos os subconjuntos de cada família.

Requisitos: Python 3.10+ e  pip install fonttools brotli   (testado com fonttools 4.63, brotli 1.2)
Uso:        python scripts/fonts.py   (ou npm run fonts:subset)
            Rode de novo só ao atualizar o @fontsource-variable ou mudar os pesos usados.

Os .woff2 gerados ficam versionados no repositório: o build e o CI não precisam de Python.
A saída é determinística (o carimbo de data da fonte original é mantido): com as mesmas
versões do fonttools e do brotli, rodar de novo gera arquivos idênticos.
"""
import sys
from pathlib import Path

for stream in (sys.stdout, sys.stderr):
    stream.reconfigure(encoding="utf-8")  # acentos legíveis também no Git Bash do Windows

try:
    import brotli  # noqa: F401 (o fontTools precisa dele para ler e gravar WOFF2)
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer
except ImportError as exc:
    sys.exit(f"Dependência ausente ({exc.name}). Instale com: pip install fonttools brotli")

ROOT = Path(__file__).resolve().parent.parent
FONTSOURCE = ROOT / "node_modules" / "@fontsource-variable"
OUT = ROOT / "src" / "assets" / "fonts"

SUBSETS = ("latin", "latin-ext")

# (pacote, arquivo de origem, arquivo gerado, limites dos eixos)
# Um intervalo (mín, máx) limita o eixo e o mantém variável; um número fixa o eixo (estática).
FONTS = (
    ("dm-sans", "dm-sans-{subset}-opsz-normal.woff2", "dm-sans-{subset}-opsz-normal.woff2", {"wght": (400, 600)}),
    ("red-hat-mono", "red-hat-mono-{subset}-wght-normal.woff2", "red-hat-mono-{subset}-500-normal.woff2", {"wght": 500}),
)


def layout_features(font):
    """Features OpenType declaradas no GSUB e no GPOS."""
    return {
        tag: sorted({record.FeatureTag for record in font[tag].table.FeatureList.FeatureRecord})
        for tag in ("GSUB", "GPOS")
        if tag in font and font[tag].table.FeatureList
    }


def describe_axes(font):
    if "fvar" not in font:
        return "estática"
    return ", ".join(f"{a.axisTag} {a.minValue:g}-{a.maxValue:g}" for a in font["fvar"].axes)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    total_before = total_after = 0

    for package, source_name, output_name, limits in FONTS:
        for subset in SUBSETS:
            source_path = FONTSOURCE / package / "files" / source_name.format(subset=subset)
            output_path = OUT / output_name.format(subset=subset)
            if not source_path.exists():
                sys.exit(f"Arquivo não encontrado: {source_path}\nRode `npm ci` antes.")

            # recalcTimestamp=False mantém o head.modified original: saída reproduzível.
            source = TTFont(source_path, recalcTimestamp=False)
            font = instancer.instantiateVariableFont(source, limits)

            # Nada além dos eixos pode mudar: mesmos glifos, mesmo cmap, mesmas features.
            if font.getGlyphOrder() != source.getGlyphOrder():
                sys.exit(f"{output_path.name}: a lista de glifos mudou")
            if font.getBestCmap() != source.getBestCmap():
                sys.exit(f"{output_path.name}: o mapa de caracteres (cmap) mudou")
            if layout_features(font) != layout_features(source):
                sys.exit(f"{output_path.name}: as features OpenType mudaram")

            font.flavor = "woff2"
            font.save(output_path)

            before, after = source_path.stat().st_size, output_path.stat().st_size
            total_before += before
            total_after += after
            print(f"{output_path.relative_to(ROOT).as_posix()}: {before:,} -> {after:,} bytes ({describe_axes(font)})")

    print(f"Total: {total_before:,} -> {total_after:,} bytes")


if __name__ == "__main__":
    main()
