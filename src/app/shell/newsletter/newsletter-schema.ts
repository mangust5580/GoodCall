import { z } from 'zod';
import { NEWSLETTER_EMPTY_ERROR, NEWSLETTER_INVALID_ERROR } from './newsletter-content';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const newsletterEmailSchema = z
  .string()
  .transform((value) => value.trim())
  .superRefine((value, ctx) => {
    if (value.length === 0) {
      ctx.addIssue({ code: 'custom', message: NEWSLETTER_EMPTY_ERROR });
      return;
    }

    if (!EMAIL_PATTERN.test(value)) {
      ctx.addIssue({ code: 'custom', message: NEWSLETTER_INVALID_ERROR });
    }
  });

export const newsletterFormSchema = z.object({
  email: newsletterEmailSchema,
});

export type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;

export interface NewsletterValidationSuccess {
  ok: true;
  email: string;
}

export interface NewsletterValidationFailure {
  ok: false;
  error: string;
}

export type NewsletterValidationResult = NewsletterValidationSuccess | NewsletterValidationFailure;

export function validateNewsletterEmail(value: string): NewsletterValidationResult {
  const result = newsletterFormSchema.safeParse({ email: value });

  if (result.success) {
    return { ok: true, email: result.data.email };
  }

  const message = result.error.issues[0]?.message;

  return { ok: false, error: message ?? NEWSLETTER_INVALID_ERROR };
}
