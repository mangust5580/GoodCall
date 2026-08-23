import { Icon } from '../ui';
import { FeedbackActionButton } from './feedbackAction';
import type { FeedbackAction } from './feedbackAction';

interface EmptyStateProps {
  readonly title: string;
  readonly message: string;
  readonly action: FeedbackAction;
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <section className="empty-state">
      <Icon className="empty-state__icon" name="cart" />
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__message">{message}</p>
      <FeedbackActionButton action={action} className="empty-state__action" />
    </section>
  );
}
