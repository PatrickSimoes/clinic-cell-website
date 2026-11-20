/**
 * Idioma da página para os componentes: <IdiomaContext value={conteudoDoIdioma(id)}> no App e
 * useIdioma() em cada componente (textos, seções, mensagens do WhatsApp e serviços do idioma).
 */
import { createContext, useContext } from 'react';
import { conteudoDoIdioma } from './conteudo.js';

export const IdiomaContext = createContext(conteudoDoIdioma('pt'));

export function useIdioma() {
  return useContext(IdiomaContext);
}
