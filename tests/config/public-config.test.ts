import { describe, it, expect } from 'vitest';
import { z } from 'zod';

describe('Public Config Validation', () => {
  const BaseSchema = z
    .string()
    .startsWith('/')
    .refine(
      (val) => !val.includes('://') && !val.startsWith('//'),
      'Base must not be external or protocol-relative URL'
    )
    .transform((val) => (val.endsWith('/') ? val : `${val}/`))
    .pipe(z.string().endsWith('/'));

  const PublicConfigSchema = z.object({
    base: BaseSchema,
    mode: z.enum(['development', 'production']),
    dev: z.boolean(),
    prod: z.boolean(),
    deploymentId: z.string().min(1),
  });

  it('accepts valid dev base', () => {
    const config = PublicConfigSchema.parse({
      base: '/',
      mode: 'development',
      dev: true,
      prod: false,
      deploymentId: 'goodcall-github-pages',
    });

    expect(config.base).toBe('/');
  });

  it('accepts valid project base', () => {
    const config = PublicConfigSchema.parse({
      base: '/GoodCall/',
      mode: 'production',
      dev: false,
      prod: true,
      deploymentId: 'goodcall-github-pages',
    });

    expect(config.base).toBe('/GoodCall/');
  });

  it('normalizes base with trailing slash', () => {
    const config = PublicConfigSchema.parse({
      base: '/GoodCall',
      mode: 'production',
      dev: false,
      prod: true,
      deploymentId: 'goodcall-github-pages',
    });

    expect(config.base).toBe('/GoodCall/');
  });

  it('rejects base without leading slash', () => {
    expect(() => {
      PublicConfigSchema.parse({
        base: 'GoodCall/',
        mode: 'production',
        dev: false,
        prod: true,
        deploymentId: 'goodcall-github-pages',
      });
    }).toThrow();
  });

  it('rejects external base', () => {
    expect(() => {
      PublicConfigSchema.parse({
        base: 'https://example.com/GoodCall/',
        mode: 'production',
        dev: false,
        prod: true,
        deploymentId: 'goodcall-github-pages',
      });
    }).toThrow();
  });

  it('rejects protocol-relative base', () => {
    expect(() => {
      PublicConfigSchema.parse({
        base: '//example.com/GoodCall/',
        mode: 'production',
        dev: false,
        prod: true,
        deploymentId: 'goodcall-github-pages',
      });
    }).toThrow();
  });

  it('requires deployment ID', () => {
    expect(() => {
      PublicConfigSchema.parse({
        base: '/',
        mode: 'development',
        dev: true,
        prod: false,
        deploymentId: '',
      });
    }).toThrow();
  });
});
