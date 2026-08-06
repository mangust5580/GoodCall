import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './GlobalSearchForm.module.scss';
import { Button, TextField } from '@/shared/ui';
import {
  SEARCH_EMPTY_ERROR,
  SEARCH_FIELD_LABEL,
  SEARCH_LANDMARK_LABEL,
  SEARCH_QUERY_PARAM,
  SEARCH_SUBMIT_LABEL,
  buildSearchLocation,
  readSearchQuery,
} from './header-core-config';

export interface GlobalSearchFormProps {
  className?: string | undefined;
}

export function GlobalSearchForm({ className }: GlobalSearchFormProps): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const fieldId = React.useId();

  const [query, setQuery] = React.useState('');
  const [error, setError] = React.useState<string | undefined>(undefined);

  const urlQuery = readSearchQuery(location.pathname, location.search);

  React.useEffect(() => {
    if (urlQuery !== null) {
      setQuery(urlQuery);
    }
  }, [urlQuery]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const normalized = query.trim();

    if (normalized === '') {
      setError(SEARCH_EMPTY_ERROR);
      inputRef.current?.focus();
      return;
    }

    setError(undefined);
    navigate(buildSearchLocation(normalized));
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value);

    if (error !== undefined) {
      setError(undefined);
    }
  }

  return (
    <form
      role="search"
      aria-label={SEARCH_LANDMARK_LABEL}
      className={[styles['search'], className].filter(Boolean).join(' ')}
      onSubmit={handleSubmit}
      noValidate
    >
      <TextField
        ref={inputRef}
        id={fieldId}
        name={SEARCH_QUERY_PARAM}
        type="search"
        label={SEARCH_FIELD_LABEL}
        value={query}
        onChange={handleChange}
        className={styles['field']}
        {...(error === undefined ? {} : { error })}
      />
      <Button type="submit" className={styles['submit']}>
        {SEARCH_SUBMIT_LABEL}
      </Button>
    </form>
  );
}
