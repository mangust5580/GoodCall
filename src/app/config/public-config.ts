import { z } from 'zod';

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

type PublicConfig = z.infer<typeof PublicConfigSchema>;

function validatePublicConfig(): PublicConfig {
  return PublicConfigSchema.parse({
    base: import.meta.env.BASE_URL,
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD,
    deploymentId: import.meta.env.VITE_DEPLOYMENT_ID || 'goodcall-github-pages',
  });
}

export const publicConfig = validatePublicConfig();
