/**
 * Rótulo de botão em duas linhas: ação + canal ("Solicitar orçamento" / "pelo WhatsApp").
 * O espaço entre as linhas garante o nome acessível "Solicitar orçamento pelo WhatsApp".
 * @param {{ children: import('react').ReactNode, sub: string }} props
 */
export function StackedLabel({ children, sub }) {
  return (
    <span className="button__label">
      <span>{children}</span> <span className="button__sub">{sub}</span>
    </span>
  );
}
