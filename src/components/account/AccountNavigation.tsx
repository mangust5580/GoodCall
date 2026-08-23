import { Icon } from '../ui';
import type { IconName } from '../ui';

export interface AccountNavigationItem {
  readonly id: string;
  readonly label: string;
  readonly icon: IconName;
  readonly href: string;
}

interface AccountNavigationProps {
  readonly label: string;
  readonly items: readonly AccountNavigationItem[];
  readonly currentId?: string;
  readonly signOutLabel: string;
  readonly onSignOut: () => void;
}

export function AccountNavigation({
  label,
  items,
  currentId,
  signOutLabel,
  onSignOut,
}: AccountNavigationProps) {
  return (
    <nav aria-label={label} className="account-navigation">
      <ul className="account-navigation__list">
        {items.map((item) => {
          const current = item.id === currentId;
          const rowClasses = ['account-navigation__row'];

          if (current) {
            rowClasses.push('account-navigation__row--current');
          }

          return (
            <li className="account-navigation__item" key={item.id}>
              <a
                aria-current={current ? 'page' : undefined}
                className={rowClasses.join(' ')}
                href={item.href}
              >
                <Icon className="account-navigation__icon" name={item.icon} />
                <span className="account-navigation__label">{item.label}</span>
              </a>
            </li>
          );
        })}
        <li className="account-navigation__item">
          <button className="account-navigation__row" onClick={onSignOut} type="button">
            <Icon className="account-navigation__icon" name="log-out" />
            <span className="account-navigation__label">{signOutLabel}</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
