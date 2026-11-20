import { cx } from '../lib/cx.js';

/**
 * Terminal (pad) do motivo de circuito — decorativo.
 * @param {{ solid?: boolean, className?: string }} props
 */
export function Pad({ solid = false, className }) {
  return <span className={cx('pad', solid && 'pad--solid', className)} aria-hidden="true" />;
}
