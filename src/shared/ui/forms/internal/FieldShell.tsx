import React from 'react';
import styles from './FieldShell.module.scss';
import { classNames } from '../../internal/class-names';

export const REQUIRED_INDICATION = 'Обязательное поле';

export type FieldLayout = 'stacked' | 'choice';

export interface FieldShellProps {
  layout: FieldLayout;
  controlId: string;
  label: string;
  required: boolean;
  description: string | undefined;
  descriptionId: string;
  error: string | undefined;
  errorId: string;
  className: string | undefined;
  children: React.ReactNode;
}

export function FieldShell({
  layout,
  controlId,
  label,
  required,
  description,
  descriptionId,
  error,
  errorId,
  className,
  children,
}: FieldShellProps): React.ReactElement {
  const requiredIndication = required ? (
    <span className={styles['required']} aria-hidden="true">
      {REQUIRED_INDICATION}
    </span>
  ) : null;

  const messages = (
    <>
      {description === undefined ? null : (
        <p id={descriptionId} className={styles['description']}>
          {description}
        </p>
      )}
      {error === undefined ? null : (
        <p id={errorId} className={styles['error']}>
          {error}
        </p>
      )}
    </>
  );

  if (layout === 'choice') {
    return (
      <div className={classNames(styles['field'], className)}>
        <label htmlFor={controlId} className={styles['choice-row']}>
          {children}
          <span className={styles['choice-copy']}>
            <span className={styles['choice-text']}>{label}</span>
            {requiredIndication}
          </span>
        </label>
        {messages}
      </div>
    );
  }

  return (
    <div className={classNames(styles['field'], className)}>
      <div className={styles['label-row']}>
        <label htmlFor={controlId} className={styles['label']}>
          {label}
        </label>
        {requiredIndication}
      </div>
      {children}
      {messages}
    </div>
  );
}
