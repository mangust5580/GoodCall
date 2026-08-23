import { Button } from '../ui';

export type FeedbackAction =
  | { readonly label: string; readonly href: string; readonly onClick?: never }
  | { readonly label: string; readonly onClick: () => void; readonly href?: never };

interface FeedbackActionButtonProps {
  readonly action: FeedbackAction;
  readonly className: string;
  readonly variant?: 'primary' | 'secondary';
}

export function FeedbackActionButton({
  action,
  className,
  variant = 'primary',
}: FeedbackActionButtonProps) {
  if (action.href === undefined) {
    return (
      <Button className={className} onClick={action.onClick} variant={variant}>
        {action.label}
      </Button>
    );
  }

  return (
    <a className={`ui-button ui-button--${variant} ${className}`} href={action.href}>
      {action.label}
    </a>
  );
}
