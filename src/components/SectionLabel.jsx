import { cx } from '../lib/cx.js';
import { Pad } from './Pad.jsx';

/**
 * Rótulo de seção: (porta) (terminal) NOME.
 * @param {{ solid?: boolean, className?: string, children: import('react').ReactNode }} props
 */
export function SectionLabel({ solid = false, className, children }) {
  return (
    <p className={cx('section-label', className)}>
      <Pad solid={solid} />
      {children}
    </p>
  );
}
