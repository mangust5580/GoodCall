import React from 'react';
import { useForm } from 'react-hook-form';
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
import { newsletterResolver, type NewsletterFormValues } from './newsletter-schema';
import {
  clearNewsletterConsent,
  readNewsletterConsent,
  writeNewsletterConsent,
} from './newsletter-session-storage';

export type NewsletterLifecycle = 'not-subscribed' | 'submitting' | 'subscribed';

export interface NewsletterSectionProps {
  visible?: boolean;
}

export function NewsletterSection({
  visible = true,
}: NewsletterSectionProps): React.ReactElement | null {
  const headingId = React.useId();
  const timerRef = React.useRef<number | null>(null);
  const pendingRef = React.useRef(false);

  const [restoredConsent] = React.useState(() => readNewsletterConsent());

  const [lifecycle, setLifecycle] = React.useState<NewsletterLifecycle>(
    restoredConsent === null ? 'not-subscribed' : 'subscribed'
  );
  const [subscribedEmail, setSubscribedEmail] = React.useState<string | null>(
    restoredConsent === null ? null : restoredConsent.email
  );
  const [announceSuccess, setAnnounceSuccess] = React.useState(false);

  const { register, handleSubmit, formState, setFocus, reset, watch, trigger } =
    useForm<NewsletterFormValues>({
      mode: 'onSubmit',
      reValidateMode: 'onChange',
      resolver: newsletterResolver,
      defaultValues: { email: restoredConsent === null ? '' : restoredConsent.email },
    });

  const emailError = formState.errors.email?.message;
  const emailField = register('email');

  React.useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      pendingRef.current = false;
    };
  }, []);

  const currentEmail = watch('email') ?? '';
  const isPending = lifecycle === 'submitting';
  const isSubscribed = lifecycle === 'subscribed';
  const isUnchangedSubscription =
    isSubscribed && subscribedEmail !== null && currentEmail.trim() === subscribedEmail;
  const isSubmitBlocked = isPending || isUnchangedSubscription;

  function completeSubscription(email: string): void {
    timerRef.current = null;
    pendingRef.current = false;
    reset({ email });
    setSubscribedEmail(email);
    setAnnounceSuccess(true);
    setLifecycle('subscribed');
    writeNewsletterConsent(email);
  }

  function handleValidSubmit(values: NewsletterFormValues): void {
    if (pendingRef.current) {
      return;
    }

    if (isSubscribed && subscribedEmail === values.email) {
      return;
    }

    pendingRef.current = true;
    setAnnounceSuccess(false);
    setLifecycle('submitting');

    timerRef.current = window.setTimeout(() => {
      completeSubscription(values.email);
    }, NEWSLETTER_SUBMIT_DELAY_MS);
  }

  function handleInvalidSubmit(): void {
    setFocus('email');
  }

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>): void {
    void emailField.onChange(event);

    if (lifecycle === 'subscribed') {
      setLifecycle('not-subscribed');
      setSubscribedEmail(null);
      setAnnounceSuccess(false);
      clearNewsletterConsent();
    }
  }

  function handleEmailBlur(event: React.FocusEvent<HTMLInputElement>): void {
    void emailField.onBlur(event);

    if (emailError !== undefined) {
      void trigger('email');
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
          onSubmit={(event) => {
            void handleSubmit(handleValidSubmit, handleInvalidSubmit)(event);
          }}
          noValidate
        >
          <div className={styles['controls']}>
            <TextField
              ref={emailField.ref}
              name={emailField.name}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              type="email"
              label={NEWSLETTER_EMAIL_LABEL}
              autoComplete="email"
              inputMode="email"
              required
              className={styles['field']}
              {...(emailError === undefined ? {} : { error: emailError })}
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
              className={styles['status']}
              data-newsletter-status
              data-newsletter-announced={isPending || announceSuccess ? 'true' : 'false'}
              {...(isPending || announceSuccess ? { role: 'status' as const } : {})}
            >
              {statusMessage}
            </InlineStatus>
          )}
        </form>
      </PageContainer>
    </section>
  );
}
