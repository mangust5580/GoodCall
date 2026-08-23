import { useId } from 'react';
import type { FormEvent } from 'react';

import { Button } from '../ui';

interface NewsletterCardProps {
  readonly description: string;
  readonly emailLabel: string;
  readonly actionLabel: string;
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  readonly onSubmit: (email: string) => void;
  readonly placeholder?: string;
  readonly id?: string;
  readonly policyHref?: string;
  readonly policyLabel?: string;
}

export function NewsletterCard({
  description,
  emailLabel,
  actionLabel,
  value,
  onValueChange,
  onSubmit,
  placeholder,
  id,
  policyHref,
  policyLabel,
}: NewsletterCardProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;

  return (
    <form
      className="newsletter-card"
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(value);
      }}
    >
      <p className="newsletter-card__description">{description}</p>
      <label className="ui-visually-hidden" htmlFor={controlId}>
        {emailLabel}
      </label>
      <input
        autoComplete="email"
        className="ui-input"
        id={controlId}
        name="email"
        onChange={(event) => {
          onValueChange(event.target.value);
        }}
        placeholder={placeholder}
        required
        type="email"
        value={value}
      />
      <Button className="newsletter-card__submit" type="submit" variant="primary">
        {actionLabel}
      </Button>
      {policyHref === undefined || policyLabel === undefined ? null : (
        <a className="newsletter-card__policy" href={policyHref}>
          {policyLabel}
        </a>
      )}
    </form>
  );
}
