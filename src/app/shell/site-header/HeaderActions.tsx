import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './HeaderActions.module.scss';
import { USER_NAV_LABEL, headerActions } from './header-actions-config';

interface HeaderActionIconStyle extends React.CSSProperties {
  '--gc-header-action-icon': string;
}

export interface HeaderActionsProps {
  className?: string | undefined;
}

export function HeaderActions({ className }: HeaderActionsProps): React.ReactElement {
  return (
    <nav
      aria-label={USER_NAV_LABEL}
      className={[styles['actions'], className].filter(Boolean).join(' ')}
    >
      <ul className={styles['list']}>
        {headerActions.map((action) => {
          const iconStyle: HeaderActionIconStyle = {
            '--gc-header-action-icon': `url("${action.iconUrl}")`,
          };

          return (
            <li key={action.id} className={styles['item']}>
              <NavLink
                to={action.path}
                end
                aria-label={action.label}
                className={({ isActive }) =>
                  isActive ? `${styles['action']} ${styles['action-current']}` : styles['action']
                }
              >
                <span
                  className={styles['icon']}
                  style={iconStyle}
                  data-shell-icon={action.id}
                  aria-hidden="true"
                />
                <span className={styles['label']} aria-hidden="true">
                  {action.label}
                </span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
