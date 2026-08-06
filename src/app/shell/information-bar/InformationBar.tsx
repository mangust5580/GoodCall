import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './InformationBar.module.scss';
import { PageContainer, VisuallyHidden } from '@/shared/ui';
import {
  INFORMATION_BAR_CITY,
  INFORMATION_BAR_CITY_CONTEXT_PREFIX,
  INFORMATION_BAR_DISCLOSURE_LABEL,
  INFORMATION_BAR_NAV_LABEL,
  serviceLinks,
} from './information-bar-items';

export function InformationBar(): React.ReactElement {
  const [expanded, setExpanded] = React.useState(false);
  const panelId = React.useId();

  return (
    <div className={styles['information-bar']}>
      <PageContainer as="nav" aria-label={INFORMATION_BAR_NAV_LABEL} className={styles['inner']}>
        <p className={styles['city']}>
          <VisuallyHidden>{INFORMATION_BAR_CITY_CONTEXT_PREFIX}</VisuallyHidden>
          {INFORMATION_BAR_CITY}
        </p>
        <button
          type="button"
          className={styles['disclosure']}
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => {
            setExpanded((current) => !current);
          }}
        >
          {INFORMATION_BAR_DISCLOSURE_LABEL}
        </button>
        <ul id={panelId} className={styles['links']} data-expanded={String(expanded)}>
          {serviceLinks.map((link) => (
            <li key={link.key} className={styles['item']}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  isActive ? `${styles['link']} ${styles['link-current']}` : styles['link']
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </PageContainer>
    </div>
  );
}
