import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent } from 'react';

import {
  ACCOUNT_ADDRESS_LIMIT,
  accountAddressErrors,
  accountAddressInput,
} from '../../commerce/account';
import type {
  AccountAddressErrors,
  AccountAddressField,
  AccountAddressInput,
  DemoAccountAddress,
  DemoAccountProfile,
} from '../../commerce/account';
import { AddressCard } from '../../components/account';
import { ConfirmationDialog } from '../../components/feedback';
import { Button, Checkbox, Chip, Icon, PhoneField, TextField } from '../../components/ui';
import { AccountLayout } from './AccountParts';
import type { AccountLinks } from './AccountParts';

export interface AccountAddressesPageProps {
  readonly links: AccountLinks;
  readonly profile: DemoAccountProfile;
  readonly addresses: readonly DemoAccountAddress[];
  readonly defaultAddressId?: string;
  readonly onAdd: (input: AccountAddressInput, makeDefault: boolean) => string | undefined;
  readonly onUpdate: (id: string, input: AccountAddressInput, makeDefault: boolean) => boolean;
  readonly onDelete: (id: string) => boolean;
  readonly onSignOut: () => void;
  readonly focusTitle?: boolean;
}

type FormMode = { readonly kind: 'add' } | { readonly kind: 'edit'; readonly id: string };

type PendingFocus =
  | { readonly kind: 'edit-button'; readonly id: string }
  | { readonly kind: 'list-heading' }
  | { readonly kind: 'first-field' };

const FIELD_ORDER: readonly AccountAddressField[] = [
  'recipientName',
  'phone',
  'city',
  'addressLine',
  'postalCode',
];
const NAME_MAX_LENGTH = 100;
const CITY_MAX_LENGTH = 80;
const ADDRESS_MAX_LENGTH = 200;
const POSTAL_CODE_LENGTH = 6;
const SAVED_STATUS = 'Адрес сохранён в этом браузере';
const UPDATED_STATUS = 'Изменения адреса сохранены';
const DELETED_STATUS = 'Адрес удалён';

function prefilledDraft(profile: DemoAccountProfile): AccountAddressInput {
  return {
    recipientName: `${profile.firstName} ${profile.lastName}`,
    phone: profile.phone,
    city: '',
    addressLine: '',
    postalCode: '',
  };
}

function localityLine(address: DemoAccountAddress): string {
  return address.postalCode === undefined ? address.city : `${address.city}, ${address.postalCode}`;
}

export function AccountAddressesPage({
  links,
  profile,
  addresses,
  defaultAddressId,
  onAdd,
  onUpdate,
  onDelete,
  onSignOut,
  focusTitle = false,
}: AccountAddressesPageProps) {
  const idPrefix = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<FormMode>({ kind: 'add' });
  const [draft, setDraft] = useState<AccountAddressInput>(() => prefilledDraft(profile));
  const [makeDefault, setMakeDefault] = useState(false);
  const [errors, setErrors] = useState<AccountAddressErrors>({});
  const [status, setStatus] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState<string>();
  const pendingFocus = useRef<PendingFocus | undefined>(undefined);
  const fieldId = (field: AccountAddressField) => `${idPrefix}-${field}`;
  const listHeadingId = `${idPrefix}-list-heading`;
  const limitReached = addresses.length >= ACCOUNT_ADDRESS_LIMIT;
  const pendingDelete = addresses.find((address) => address.id === pendingDeleteId);

  useEffect(() => {
    const target = pendingFocus.current;

    if (target === undefined) {
      return;
    }

    pendingFocus.current = undefined;

    if (target.kind === 'first-field') {
      formRef.current?.scrollIntoView({ block: 'nearest' });
      document.getElementById(fieldId('recipientName'))?.focus({ preventScroll: true });
    } else if (target.kind === 'edit-button') {
      const button = listRef.current?.querySelector<HTMLButtonElement>(
        `[data-address-id="${target.id}"] .address-card__edit`,
      );

      if (button) {
        button.focus();
      } else {
        document.getElementById(listHeadingId)?.focus();
      }
    } else {
      document.getElementById(listHeadingId)?.focus();
    }
  });

  const resetToAdd = () => {
    setMode({ kind: 'add' });
    setDraft(prefilledDraft(profile));
    setMakeDefault(false);
    setErrors({});
  };

  const update = (field: AccountAddressField, value: string) => {
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

  const startEdit = (address: DemoAccountAddress) => {
    setMode({ kind: 'edit', id: address.id });
    setDraft(accountAddressInput(address));
    setMakeDefault(address.id === defaultAddressId);
    setErrors({});
    setStatus('');
    pendingFocus.current = { kind: 'first-field' };
  };

  const cancelEdit = () => {
    const id = mode.kind === 'edit' ? mode.id : undefined;

    resetToAdd();

    if (id !== undefined) {
      pendingFocus.current = { kind: 'edit-button', id };
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = accountAddressErrors(draft);
    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field] !== undefined);

    if (firstInvalid !== undefined) {
      setErrors(nextErrors);
      setStatus('');
      document.getElementById(fieldId(firstInvalid))?.focus();

      return;
    }

    if (mode.kind === 'edit') {
      if (onUpdate(mode.id, draft, makeDefault)) {
        const id = mode.id;

        resetToAdd();
        setStatus(UPDATED_STATUS);
        pendingFocus.current = { kind: 'edit-button', id };
      }

      return;
    }

    if (onAdd(draft, makeDefault) !== undefined) {
      resetToAdd();
      setStatus(SAVED_STATUS);

      if (addresses.length + 1 >= ACCOUNT_ADDRESS_LIMIT) {
        pendingFocus.current = { kind: 'list-heading' };
      }
    }
  };

  const confirmDelete = () => {
    if (pendingDeleteId === undefined) {
      return;
    }

    const id = pendingDeleteId;

    if (onDelete(id)) {
      if (mode.kind === 'edit' && mode.id === id) {
        resetToAdd();
      }

      setStatus(DELETED_STATUS);
      pendingFocus.current = { kind: 'list-heading' };
    }

    setPendingDeleteId(undefined);
  };

  const formHeading = mode.kind === 'edit' ? 'Редактирование адреса' : 'Добавить новый адрес';

  return (
    <AccountLayout
      crumb="Адреса доставки"
      focusTitle={focusTitle}
      links={links}
      onSignOut={onSignOut}
      section="addresses"
      title="Адреса доставки"
    >
      <p className="account-addresses__lead">
        Сохранённые адреса вашего демо-профиля. Они хранятся только в этом браузере и не
        подставляются при оформлении заказа.
      </p>

      <p
        aria-atomic="true"
        className={
          status === ''
            ? 'account-addresses__status ui-visually-hidden'
            : 'account-addresses__status'
        }
        role="status"
      >
        {status}
      </p>

      <div className="account-addresses">
        <section aria-labelledby={listHeadingId} className="account-card account-addresses__list">
          <h2 className="account-card__title" id={listHeadingId} tabIndex={-1}>
            Сохранённые адреса
          </h2>

          {addresses.length === 0 ? (
            <div className="account-addresses-empty">
              <span aria-hidden="true" className="account-addresses-empty__glyph">
                <Icon className="account-addresses-empty__icon" name="map-pin" />
              </span>
              <p className="account-addresses-empty__title">Сохранённых адресов пока нет</p>
              <p className="account-addresses-empty__message">
                Добавьте адрес — он сохранится только в этом браузере.
              </p>
            </div>
          ) : (
            <ul aria-label="Сохранённые адреса" className="account-addresses__items" ref={listRef}>
              {addresses.map((address) => (
                <li data-address-id={address.id} key={address.id}>
                  <AddressCard
                    actionContext={address.addressLine}
                    addressLine={address.addressLine}
                    badge={
                      address.id === defaultAddressId ? <Chip>Основной адрес</Chip> : undefined
                    }
                    city={address.city}
                    deleteLabel="Удалить"
                    editLabel="Редактировать"
                    onDelete={() => {
                      setPendingDeleteId(address.id);
                    }}
                    onEdit={() => {
                      startEdit(address);
                    }}
                    phone={address.phone}
                    postalCode={address.postalCode}
                    recipientName={address.recipientName}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section
          aria-labelledby={`${idPrefix}-form-heading`}
          className="account-card account-addresses__form-card"
          ref={formRef}
        >
          <h2 className="account-card__title" id={`${idPrefix}-form-heading`}>
            {limitReached && mode.kind === 'add' ? 'Новый адрес' : formHeading}
          </h2>

          {limitReached && mode.kind === 'add' ? (
            <p className="account-addresses__limit">
              Можно сохранить до {ACCOUNT_ADDRESS_LIMIT} адресов — удалите один, чтобы добавить
              новый.
            </p>
          ) : (
            <form className="account-addresses__form" noValidate onSubmit={handleSubmit}>
              <TextField
                autoComplete="name"
                error={errors.recipientName}
                id={fieldId('recipientName')}
                label="Получатель"
                maxLength={NAME_MAX_LENGTH}
                onChange={(event) => {
                  update('recipientName', event.currentTarget.value);
                }}
                placeholder="Имя и фамилия"
                required
                value={draft.recipientName}
              />
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
              <TextField
                autoComplete="address-level2"
                error={errors.city}
                id={fieldId('city')}
                label="Город"
                maxLength={CITY_MAX_LENGTH}
                onChange={(event) => {
                  update('city', event.currentTarget.value);
                }}
                placeholder="Например, Москва"
                required
                value={draft.city}
              />
              <TextField
                autoComplete="street-address"
                error={errors.addressLine}
                id={fieldId('addressLine')}
                label="Адрес"
                maxLength={ADDRESS_MAX_LENGTH}
                onChange={(event) => {
                  update('addressLine', event.currentTarget.value);
                }}
                placeholder="Улица, дом, квартира"
                required
                value={draft.addressLine}
              />
              <TextField
                autoComplete="postal-code"
                error={errors.postalCode}
                hint="Необязательно"
                id={fieldId('postalCode')}
                inputMode="numeric"
                label="Индекс"
                maxLength={POSTAL_CODE_LENGTH}
                onChange={(event) => {
                  update('postalCode', event.currentTarget.value);
                }}
                placeholder="6 цифр"
                value={draft.postalCode}
              />

              {addresses.length === 0 ? (
                <p className="account-addresses__default-note">
                  Первый сохранённый адрес станет основным.
                </p>
              ) : (
                <Checkbox
                  checked={makeDefault}
                  label="Сделать основным адресом"
                  onChange={(checked) => {
                    setMakeDefault(checked);
                    setStatus('');
                  }}
                />
              )}

              <div className="account-addresses__actions">
                <Button className="account-addresses__submit" type="submit">
                  Сохранить адрес
                </Button>
                {mode.kind === 'edit' ? (
                  <Button onClick={cancelEdit} variant="secondary">
                    Отменить
                  </Button>
                ) : null}
              </div>
            </form>
          )}
        </section>
      </div>

      <ConfirmationDialog
        cancelLabel="Отмена"
        confirmLabel="Удалить"
        message={
          pendingDelete === undefined
            ? ''
            : `${pendingDelete.addressLine}, ${localityLine(pendingDelete)}`
        }
        onConfirm={confirmDelete}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDeleteId(undefined);
          }
        }}
        open={pendingDelete !== undefined}
        title="Удалить адрес?"
      />
    </AccountLayout>
  );
}
