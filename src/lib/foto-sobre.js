/**
 * Foto real opcional da seção Sobre: src/assets/fotos/sobre.(webp|jpg|jpeg|png|avif).
 * Sem arquivo, `fotoSobreUrl` é undefined e nada é renderizado — nem espaço reservado.
 * Com arquivo, a foto também entra nos dados estruturados (image) do LocalBusiness.
 */
const fotos = import.meta.glob('../assets/fotos/sobre.{webp,jpg,jpeg,png,avif}', {
  eager: true,
  import: 'default',
});

export const fotoSobreUrl = /** @type {string | undefined} */ (Object.values(fotos)[0]);
