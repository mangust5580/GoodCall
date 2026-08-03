import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './Shell.module.scss';

export function Shell(): React.ReactElement {
  return (
    <div className={styles.shell}>
      <a href="#main" className={styles['skip-link']}>
        Skip to main content
      </a>
      <main id="main" className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}
