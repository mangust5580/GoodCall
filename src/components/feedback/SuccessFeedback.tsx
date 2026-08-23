import { Icon } from '../ui';
import { FeedbackActionButton } from './feedbackAction';
import type { FeedbackAction } from './feedbackAction';

interface SuccessFeedbackProps {
  readonly title: string;
  readonly message: string;
  readonly action: FeedbackAction;
  readonly announce?: boolean;
}

export function SuccessFeedback({
  title,
  message,
  action,
  announce = false,
}: SuccessFeedbackProps) {
  return (
    <section className="success-feedback" role={announce ? 'status' : undefined}>
      <span className="success-feedback__mark">
        <Icon name="check" />
      </span>
      <h3 className="success-feedback__title">{title}</h3>
      <p className="success-feedback__message">{message}</p>
      <FeedbackActionButton action={action} className="success-feedback__action" />
    </section>
  );
}
