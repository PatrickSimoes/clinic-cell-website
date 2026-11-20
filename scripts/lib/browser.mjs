/**
 * Localiza o Chrome ou o Edge instalado, para os scripts que usam o navegador
 * (qa-browser, lighthouse, og-image). Use CHROME_PATH para indicar outro executável.
 */
import { existsSync } from 'node:fs';

const CANDIDATOS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/microsoft-edge',
];

/** @returns {string} caminho do executável */
export function findBrowser() {
  const encontrado = [process.env.CHROME_PATH, ...CANDIDATOS].filter(Boolean).find((p) => existsSync(p));
  if (!encontrado) {
    throw new Error('Chrome ou Edge não encontrado. Instale um deles ou defina CHROME_PATH com o caminho do executável.');
  }
  return encontrado;
}
