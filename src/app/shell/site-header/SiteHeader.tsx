import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './SiteHeader.module.scss';
import { PageContainer } from '@/shared/ui';
import { BrandHomeLink } from '@/app/shell/brand';
import { GlobalSearchForm } from './GlobalSearchForm';
import { HeaderActions } from './HeaderActions';
import { CATALOG_LABEL, PRIMARY_NAV_LABEL, catalogPath } from './header-core-config';

export function SiteHeader(): React.ReactElement {
  const brandLinkClassName = styles['brand-link'] ?? '';

  return (
    <header className={styles['site-header']}>
      <PageContainer className={styles['inner']}>
        <div className={styles['identity']}>
          <BrandHomeLink className={brandLinkClassName} />
          <nav aria-label={PRIMARY_NAV_LABEL} className={styles['primary-nav']}>
            <NavLink
              to={catalogPath}
              end
              className={({ isActive }) =>
                isActive ? `${styles['catalog']} ${styles['catalog-current']}` : styles['catalog']
              }
            >
              {CATALOG_LABEL}
            </NavLink>
          </nav>
        </div>
        <GlobalSearchForm className={styles['search-slot']} />
        <HeaderActions className={styles['actions-slot']} />
      </PageContainer>
    </header>
  );
}
