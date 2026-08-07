import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  NEWSLETTER_CANONICAL_CONSENT,
  NEWSLETTER_CONSENT_NOTE,
  NEWSLETTER_DEMO_BOUNDARY,
  NEWSLETTER_DESCRIPTION,
  NEWSLETTER_EMAIL_LABEL,
  NEWSLETTER_EMPTY_ERROR,
  NEWSLETTER_HEADING,
  NEWSLETTER_INVALID_ERROR,
  NEWSLETTER_PENDING_STATUS,
  NEWSLETTER_SUBMIT_DELAY_MS,
  NEWSLETTER_SUBMIT_LABEL,
  NEWSLETTER_SUBMIT_PENDING_LABEL,
  NEWSLETTER_SUCCESS_STATUS,
} from '@/app/shell/newsletter/newsletter-content';
import {
  newsletterFormSchema,
  newsletterResolver,
  type NewsletterFormValues,
} from '@/app/shell/newsletter/newsletter-schema';

interface ResolvedNewsletter {
  ok: boolean;
  email?: string | undefined;
  error?: string | undefined;
}

async function resolveEmail(value: string): Promise<ResolvedNewsletter> {
  const result = await newsletterResolver({ email: value } as NewsletterFormValues, undefined, {
    shouldUseNativeValidation: false,
    fields: {},
  });

  const message = (result.errors as { email?: { message?: string } }).email?.message;

  if (message === undefined) {
    return { ok: true, email: (result.values as Partial<NewsletterFormValues>).email };
  }

  return { ok: false, error: message };
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const newsletterDir = path.join(repoRoot, 'src', 'app', 'shell', 'newsletter');

function newsletterSource(): string {
  return fs
    .readdirSync(newsletterDir)
    .filter((name) => /\.(ts|tsx|scss)$/.test(name))
    .map((name) => fs.readFileSync(path.join(newsletterDir, name), 'utf-8'))
    .join('\n');
}

describe('Newsletter content', () => {
  it('uses the exact canonical heading', () => {
    expect(NEWSLETTER_HEADING).toBe('Будьте в курсе новинок и акций');
  });

  it('uses the exact canonical description', () => {
    expect(NEWSLETTER_DESCRIPTION).toBe(
      'Получайте подборки товаров, новые материалы и информацию об акциях GoodCall.'
    );
  });

  it('uses the exact canonical action label', () => {
    expect(NEWSLETTER_SUBMIT_LABEL).toBe('Подписаться');
    expect(NEWSLETTER_SUBMIT_PENDING_LABEL).toBe('Подписываем…');
  });

  it('uses the exact canonical success copy', () => {
    expect(NEWSLETTER_SUCCESS_STATUS).toBe('Вы подписаны на новости и акции GoodCall.');
  });

  it('retains the canonical consent note verbatim', () => {
    expect(NEWSLETTER_CANONICAL_CONSENT).toBe(
      'Нажимая «Подписаться», вы соглашаетесь с демонстрационными условиями обработки данных.'
    );
    expect(NEWSLETTER_CONSENT_NOTE.startsWith(NEWSLETTER_CANONICAL_CONSENT)).toBe(true);
  });

  it('states visibly that no real delivery occurs', () => {
    expect(NEWSLETTER_DEMO_BOUNDARY).toBe('Реальная отправка писем не выполняется.');
    expect(NEWSLETTER_CONSENT_NOTE).toContain(NEWSLETTER_DEMO_BOUNDARY);
  });

  it('names the email field with a persistent visible label', () => {
    expect(NEWSLETTER_EMAIL_LABEL).toBe('Электронная почта');
  });

  it('uses an implementation-level pending message', () => {
    expect(NEWSLETTER_PENDING_STATUS).toBe('Подписываем адрес электронной почты…');
  });

  it('declares a short deterministic demo delay', () => {
    expect(NEWSLETTER_SUBMIT_DELAY_MS).toBe(400);
    expect(NEWSLETTER_SUBMIT_DELAY_MS).toBeGreaterThanOrEqual(300);
    expect(NEWSLETTER_SUBMIT_DELAY_MS).toBeLessThanOrEqual(500);
  });

  it('declares no unsubscribe content', () => {
    expect(newsletterSource()).not.toContain('Отписаться');
    expect(newsletterSource()).not.toContain('unsubscribe');
  });

  it('declares no default or demonstration email value', () => {
    expect(newsletterSource()).not.toMatch(/[\w.]+@[\w.]+\.\w+/);
  });
});

describe('Newsletter schema', () => {
  it('rejects an empty value with the canonical message', async () => {
    const result = await resolveEmail('');

    expect(result.ok).toBe(false);
    expect(result.error).toBe(NEWSLETTER_EMPTY_ERROR);
  });

  it('rejects a whitespace-only value as empty', async () => {
    const result = await resolveEmail('   ');

    expect(result.ok).toBe(false);
    expect(result.error).toBe(NEWSLETTER_EMPTY_ERROR);
  });

  it.each(['not-an-email', 'user@', '@example.com', 'user@example', 'user example.com'])(
    'rejects %s with the format message',
    async (value) => {
      const result = await resolveEmail(value);

      expect(result.ok).toBe(false);
      expect(result.error).toBe(NEWSLETTER_INVALID_ERROR);
    }
  );

  it('accepts a valid address', async () => {
    const result = await resolveEmail('reader@goodcall.test');

    expect(result.ok).toBe(true);
    expect(result.email).toBe('reader@goodcall.test');
  });

  it('trims surrounding whitespace', async () => {
    const result = await resolveEmail('   reader@goodcall.test   ');

    expect(result.ok).toBe(true);
    expect(result.email).toBe('reader@goodcall.test');
  });

  it('preserves the entered casing', async () => {
    const result = await resolveEmail('Reader.Name@GoodCall.test');

    expect(result.ok).toBe(true);
    expect(result.email).toBe('Reader.Name@GoodCall.test');
  });

  it('reports exactly one issue per invalid submission', () => {
    const parsed = newsletterFormSchema.safeParse({ email: 'broken' });

    expect(parsed.success).toBe(false);
    expect(parsed.success ? [] : parsed.error.issues).toHaveLength(1);
  });

  it('sources every resolver message from the Zod schema alone', () => {
    const source = fs.readFileSync(path.join(newsletterDir, 'newsletter-schema.ts'), 'utf-8');
    const literalMessages = source.match(/'[^']*[а-яА-Я][^']*'/g) ?? [];

    expect(literalMessages, 'no duplicated validation copy outside the content module').toEqual([]);
    expect((source.match(/EMAIL_PATTERN/g) ?? []).length, 'one email pattern').toBe(2);
  });
});
