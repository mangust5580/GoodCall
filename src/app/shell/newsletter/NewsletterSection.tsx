import React from 'react';
import styles from './NewsletterSection.module.scss';
import { Button, InlineStatus, PageContainer, TextField } from '@/shared/ui';
import {
  NEWSLETTER_CONSENT_NOTE,
  NEWSLETTER_DESCRIPTION,
  NEWSLETTER_EMAIL_LABEL,
  NEWSLETTER_HEADING,
  NEWSLETTER_PENDING_STATUS,
  NEWSLETTER_SUBMIT_DELAY_MS,
  NEWSLETTER_SUBMIT_LABEL,
  NEWSLETTER_SUBMIT_PENDING_LABEL,
  NEWSLETTER_SUCCESS_STATUS,
} from './newsletter-content';
import { validateNewsletterEmail } from './newsletter-schema';

export type NewsletterLifecycle = 'not-subscribed' | 'submitting' | 'subscribed';

export interface NewsletterSectionProps {
  visible?: boolean;
}

export function NewsletterSection({
  visible = true,
}: NewsletterSectionProps): React.ReactElement | null {
  const headingId = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const timerRef = React.useRef<number | null>(null);
  const pendingRef = React.useRef(false);

  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [lifecycle, setLifecycle] = React.useState<NewsletterLifecycle>('not-subscribed');
  const [subscribedEmail, setSubscribedEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      pendingRef.current = false;
    };
  }, []);

  const isPending = lifecycle === 'submitting';
  const isSubscribed = lifecycle === 'subscribed';
  const isUnchangedSubscription =
    isSubscribed && subscribedEmail !== null && email.trim() === subscribedEmail;
  const isSubmitBlocked = isPending || isUnchangedSubscription;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (pendingRef.current) {
      return;
    }

    const validation = validateNewsletterEmail(email);

    if (!validation.ok) {
      setError(validation.error);
      inputRef.current?.focus();
      return;
    }

    if (isSubscribed && subscribedEmail === validation.email) {
      return;
    }

    pendingRef.current = true;
    setError(undefined);
    setLifecycle('submitting');

    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      pendingRef.current = false;
      setSubscribedEmail(validation.email);
      setLifecycle('subscribed');
    }, NEWSLETTER_SUBMIT_DELAY_MS);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setEmail(event.target.value);

    if (error !== undefined) {
      setError(undefined);
    }

    if (lifecycle === 'subscribed') {
      setLifecycle('not-subscribed');
      setSubscribedEmail(null);
    }
  }

  if (!visible) {
    return null;
  }

  const statusMessage = isPending
    ? NEWSLETTER_PENDING_STATUS
    : isSubscribed
      ? NEWSLETTER_SUCCESS_STATUS
      : undefined;

  return (
    <section className={styles['newsletter']} aria-labelledby={headingId}>
      <PageContainer className={styles['inner']}>
        <div className={styles['copy']}>
          <h2 id={headingId} className={styles['heading']}>
            {NEWSLETTER_HEADING}
          </h2>
          <p className={styles['description']}>{NEWSLETTER_DESCRIPTION}</p>
        </div>
        <form
          className={styles['form']}
          aria-labelledby={headingId}
          aria-busy={isPending || undefined}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className={styles['controls']}>
            <TextField
              ref={inputRef}
              name="email"
              type="email"
              label={NEWSLETTER_EMAIL_LABEL}
              value={email}
              onChange={handleChange}
              autoComplete="email"
              inputMode="email"
              required
              className={styles['field']}
              {...(error === undefined ? {} : { error })}
            />
            <Button
              type="submit"
              disabled={isSubmitBlocked}
              className={styles['submit']}
              data-newsletter-submit
            >
              {isPending ? NEWSLETTER_SUBMIT_PENDING_LABEL : NEWSLETTER_SUBMIT_LABEL}
            </Button>
          </div>
          <p className={styles['consent']}>{NEWSLETTER_CONSENT_NOTE}</p>
          {statusMessage === undefined ? null : (
            <InlineStatus
              tone={isPending ? 'pending' : 'success'}
              role="status"
              className={styles['status']}
              data-newsletter-status
            >
              {statusMessage}
            </InlineStatus>
          )}
        </form>
      </PageContainer>
    </section>
  );
}
