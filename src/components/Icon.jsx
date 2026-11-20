import { cx } from '../lib/cx.js';

/**
 * Ícone Lucide decorativo (sempre aria-hidden; o texto ao lado dá o significado).
 * @param {{ icon: import('react').ComponentType<any>, className?: string }} props
 */
export function Icon({ icon: Component, className }) {
  return <Component className={cx('icon', className)} aria-hidden="true" focusable="false" />;
}
