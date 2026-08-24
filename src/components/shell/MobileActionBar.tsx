import { Icon } from '../ui';
import { shellActions } from './shellActions';
import type { ShellActionInput } from './shellActions';

export type MobileActionBarProps = Omit<ShellActionInput, 'fallbackHref'>;

export function MobileActionBar(props: MobileActionBarProps) {
  const actions = shellActions({ fallbackHref: import.meta.env.BASE_URL, ...props });

  return (
    <nav aria-label="Быстрые действия" className="mobile-action-bar">
      <ul className="mobile-action-bar__list">
        {actions.map((action) => (
          <li className="mobile-action-bar__item" key={action.label}>
            <a className="mobile-action-bar__link" href={action.href}>
              <span className="mobile-action-bar__glyph">
                <Icon name={action.icon} />
                {action.count === undefined ? null : (
                  <span className="mobile-action-bar__badge">{action.count}</span>
                )}
              </span>
              <span className="mobile-action-bar__label">{action.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
