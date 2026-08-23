import { Toggle } from '../ui';

interface AccountSettingsCardProps {
  readonly emailLabel: string;
  readonly emailChecked: boolean;
  readonly onEmailChange: (checked: boolean) => void;
  readonly pushLabel: string;
  readonly pushChecked: boolean;
  readonly onPushChange: (checked: boolean) => void;
  readonly actionLabel: string;
  readonly onAction: () => void;
}

export function AccountSettingsCard({
  emailLabel,
  emailChecked,
  onEmailChange,
  pushLabel,
  pushChecked,
  onPushChange,
  actionLabel,
  onAction,
}: AccountSettingsCardProps) {
  return (
    <section className="account-settings-card">
      <div className="account-settings-card__row">
        <Toggle checked={emailChecked} label={emailLabel} onChange={onEmailChange} />
      </div>
      <div className="account-settings-card__row">
        <Toggle checked={pushChecked} label={pushLabel} onChange={onPushChange} />
      </div>
      <button className="account-settings-card__action" onClick={onAction} type="button">
        {actionLabel}
      </button>
    </section>
  );
}
