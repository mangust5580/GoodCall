import { NotFoundPage } from './NotFoundPage';
import { NEWSLETTER_HIDDEN_SHELL_POLICY } from '@/app/routing/route-shell-policy';

export const Component = NotFoundPage;

export const handle = {
  title: 'Page not found — GoodCall',
  ...NEWSLETTER_HIDDEN_SHELL_POLICY,
};
