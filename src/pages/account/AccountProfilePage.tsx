import { useId, useState } from 'react';
import type { FormEvent } from 'react';

import {
  ACCOUNT_BIRTH_DATE_MIN,
  ACCOUNT_GENDER_OPTIONS,
  accountProfileErrors,
  normalizeAccountProfile,
  todayIsoDate,
} from '../../commerce/account';
import type {
  AccountProfileErrors,
  AccountProfileField,
  DemoAccountGender,
  DemoAccountProfile,
} from '../../commerce/account';
import { Button, DateField, Icon, PhoneField, SelectField, TextField } from '../../components/ui';
import { AccountLayout } from './AccountParts';
import type { AccountLinks } from './AccountParts';

export interface AccountProfilePageProps {
  readonly links: AccountLinks;
  readonly profile: DemoAccountProfile;
  readonly onSave: (profile: DemoAccountProfile) => boolean;
  readonly onSignOut: () => void;
  readonly focusTitle?: boolean;
}

const FIELD_ORDER: readonly AccountProfileField[] = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'birthDate',
  'gender',
];
const SAVED_STATUS = 'Изменения сохранены в этом браузере';
const NAME_MAX_LENGTH = 50;
const EMAIL_MAX_LENGTH = 254;

function isGender(value: string): value is DemoAccountGender {
  return ACCOUNT_GENDER_OPTIONS.some((option) => option.value === value);
}

export function AccountProfilePage({
  links,
  profile,
  onSave,
  onSignOut,
  focusTitle = false,
}: AccountProfilePageProps) {
  const idPrefix = useId();
  const [draft, setDraft] = useState<DemoAccountProfile>(profile);
  const [errors, setErrors] = useState<AccountProfileErrors>({});
  const [status, setStatus] = useState('');
  const fieldId = (field: AccountProfileField) => `${idPrefix}-${field}`;
  const today = todayIsoDate();

  const update = <K extends AccountProfileField>(field: K, value: DemoAccountProfile[K]) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setStatus('');
    setErrors((current) => {
      if (current[field] === undefined) {
        return current;
      }

      const next = { ...current };
      delete next[field];

      return next;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = accountProfileErrors(draft, today);
    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field] !== undefined);

    if (firstInvalid !== undefined) {
      setErrors(nextErrors);
      setStatus('');
      document.getElementById(fieldId(firstInvalid))?.focus();

      return;
    }

    const normalized = normalizeAccountProfile(draft);

    if (onSave(normalized)) {
      setDraft(normalized);
      setErrors({});
      setStatus(SAVED_STATUS);
    }
  };

  return (
    <AccountLayout
      crumb="Профиль"
      focusTitle={focusTitle}
      links={links}
      onSignOut={onSignOut}
      section="profile"
      title="Профиль"
    >
      <section aria-labelledby={`${idPrefix}-heading`} className="account-card account-profile">
        <div className="account-profile__intro">
          <h2 className="account-profile__heading" id={`${idPrefix}-heading`}>
            Личные данные
          </h2>
          <p className="account-profile__lead">
            Управляйте своими личными данными и контактной информацией.
          </p>
        </div>

        <div className="account-profile__body">
          <div className="account-profile__identity">
            <span aria-hidden="true" className="account-profile__avatar">
              <Icon className="account-profile__avatar-icon" name="person" />
            </span>
            <p className="account-profile__name">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="account-profile__email">{profile.email}</p>
          </div>

          <form className="account-profile__form" noValidate onSubmit={handleSubmit}>
            <div className="account-profile__grid">
              <TextField
                autoComplete="given-name"
                error={errors.firstName}
                id={fieldId('firstName')}
                label="Имя"
                maxLength={NAME_MAX_LENGTH}
                onChange={(event) => {
                  update('firstName', event.currentTarget.value);
                }}
                required
                value={draft.firstName}
              />
              <TextField
                autoComplete="family-name"
                error={errors.lastName}
                id={fieldId('lastName')}
                label="Фамилия"
                maxLength={NAME_MAX_LENGTH}
                onChange={(event) => {
                  update('lastName', event.currentTarget.value);
                }}
                required
                value={draft.lastName}
              />
              <div className="account-profile__wide">
                <TextField
                  autoComplete="email"
                  error={errors.email}
                  id={fieldId('email')}
                  inputMode="email"
                  label="E-mail"
                  maxLength={EMAIL_MAX_LENGTH}
                  onChange={(event) => {
                    update('email', event.currentTarget.value);
                  }}
                  required
                  type="email"
                  value={draft.email}
                />
              </div>
              <div className="account-profile__wide">
                <PhoneField
                  autoComplete="tel"
                  error={errors.phone}
                  id={fieldId('phone')}
                  label="Телефон"
                  onValueChange={(value) => {
                    update('phone', value);
                  }}
                  required
                  value={draft.phone}
                />
              </div>
              <DateField
                error={errors.birthDate}
                id={fieldId('birthDate')}
                label="Дата рождения"
                max={today}
                min={ACCOUNT_BIRTH_DATE_MIN}
                onValueChange={(value) => {
                  update('birthDate', value);
                }}
                placeholder="Выберите дату"
                value={draft.birthDate}
              />
              <SelectField
                error={errors.gender}
                id={fieldId('gender')}
                label="Пол"
                onValueChange={(value) => {
                  if (isGender(value)) {
                    update('gender', value);
                  }
                }}
                options={ACCOUNT_GENDER_OPTIONS}
                value={draft.gender}
              />
            </div>

            <div className="account-profile__footer">
              <p
                aria-atomic="true"
                className={
                  status === ''
                    ? 'account-profile__status ui-visually-hidden'
                    : 'account-profile__status'
                }
                role="status"
              >
                {status}
              </p>
              <Button className="account-profile__submit" type="submit">
                Сохранить изменения
              </Button>
            </div>
          </form>
        </div>
      </section>
    </AccountLayout>
  );
}
