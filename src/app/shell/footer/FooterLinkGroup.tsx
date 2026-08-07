import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './SiteFooter.module.scss';
import { footerDisclosureLabel } from './footer-content';
import type { FooterGroupDescriptor } from './footer-navigation';

export interface FooterLinkGroupProps {
  group: FooterGroupDescriptor;
}

export function FooterLinkGroup({ group }: FooterLinkGroupProps): React.ReactElement {
  const [expanded, setExpanded] = React.useState(false);
  const panelId = React.useId();
  const titleId = React.useId();

  return (
    <div className={styles['group']}>
      <div className={styles['group-header']}>
        <h2 id={titleId} className={styles['group-title']}>
          {group.title}
        </h2>
        <button
          type="button"
          className={styles['group-disclosure']}
          aria-expanded={expanded}
          aria-controls={panelId}
          aria-label={footerDisclosureLabel(group.title, expanded)}
          onClick={() => {
            setExpanded((current) => !current);
          }}
        >
          <span className={styles['group-disclosure-mark']} aria-hidden="true" />
        </button>
      </div>
      <nav aria-labelledby={titleId} className={styles['group-nav']}>
        <ul id={panelId} className={styles['group-links']} data-expanded={String(expanded)}>
          {group.links.map((link) => (
            <li key={link.routeKey} className={styles['group-item']}>
              <NavLink
                to={link.path}
                end
                className={({ isActive }) =>
                  isActive ? `${styles['link']} ${styles['link-current']}` : styles['link']
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
