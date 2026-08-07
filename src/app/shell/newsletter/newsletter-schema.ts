import { z } from 'zod';
import type { Resolver } from 'react-hook-form';
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

export const newsletterResolver: Resolver<NewsletterFormValues> = (values) => {
  const result = newsletterFormSchema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const message = result.error.issues[0]?.message ?? NEWSLETTER_INVALID_ERROR;

  return {
    values: {},
    errors: {
      email: {
        type: 'validation',
        message,
      },
    },
  };
};
