/**
 * Imagem de cada área de serviço: src/assets/servicos/<id da área>.(svg|webp|jpg|jpeg|png|avif).
 * Hoje são ilustrações (svg). Para usar uma foto real, coloque <id>.webp (ou .jpg) na mesma
 * pasta: a foto tem prioridade sobre a ilustração. O build falha se uma área ficar sem imagem.
 */
const arquivos = import.meta.glob('../assets/servicos/*.{svg,webp,jpg,jpeg,png,avif}', {
  eager: true,
  import: 'default',
});

/** id da área → URL da imagem (foto antes da ilustração). */
export const imagensDeServico = /** @type {Record<string, string>} */ ({});
const ilustracaoPorUltimo = ([a], [b]) => Number(a.endsWith('.svg')) - Number(b.endsWith('.svg'));
for (const [caminho, url] of Object.entries(arquivos).sort(ilustracaoPorUltimo)) {
  const id = caminho.split('/').pop().replace(/\.\w+$/, '');
  imagensDeServico[id] ??= /** @type {string} */ (url);
}
