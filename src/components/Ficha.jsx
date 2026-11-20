import { cx } from '../lib/cx.js';
import { Icon } from './Icon.jsx';

/**
 * Ficha técnica (<dl>): rótulo → valor. Empilha em espaços estreitos (container query).
 * @param {{ className?: string, children: import('react').ReactNode }} props
 */
export function Ficha({ className, children }) {
  return <dl className={cx('ficha', className)}>{children}</dl>;
}

/**
 * @param {{ term: string, icon?: import('react').ComponentType<any>, children: import('react').ReactNode }} props
 */
export function FichaRow({ term, icon, children }) {
  return (
    <div className="ficha__row">
      <dt className="ficha__term">
        {icon ? <Icon icon={icon} /> : null}
        {term}
      </dt>
      <dd className="ficha__value">{children}</dd>
    </div>
  );
}
