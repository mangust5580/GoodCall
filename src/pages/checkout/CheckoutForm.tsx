import { useCallback, useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';

import { BenefitsStrip } from '../../components/content';
import type {
  AddressLookupClient,
  CityLookupClient,
  CityOption,
  HouseOption,
  StreetOption,
} from '../../components/location';
import {
  Icon,
  PhoneField,
  Radio,
  SelectField,
  TextField,
  TextareaField,
} from '../../components/ui';
import type { IconName } from '../../components/ui';
import type { CartTotals } from '../cart/cartPricing';
import type { CartLine } from '../cart/cartStore';
import { DEMO_STORES, findStore } from '../stores';
import { CheckoutAddressCombobox } from './CheckoutAddressCombobox';
import { CheckoutOrderSummary } from './CheckoutOrderSummary';
import {
  CHECKOUT_BENEFITS,
  CHECKOUT_DELIVERY_SLOTS,
  CHECKOUT_FIELD_ORDER,
  CHECKOUT_MAX_LENGTH,
  CHECKOUT_PAYMENT_METHODS,
  checkoutControlId,
  checkoutDeliveryDates,
  initialCheckoutForm,
  isAddressLevelConfirmed,
  isManualAddressLevel,
  normalizeCheckoutForm,
  validateCheckoutForm,
} from './checkoutFormModel';
import type {
  CheckoutDeliveryMethod,
  CheckoutFormState,
  CheckoutValidatedField,
} from './checkoutFormModel';

interface CheckoutFormProps {
  readonly lines: readonly CartLine[];
  readonly totals: CartTotals;
  readonly initialCity: CityOption | null;
  readonly cityLookupClient: CityLookupClient;
  readonly addressLookupClient: AddressLookupClient;
  readonly addressLookupConfigured: boolean;
}

interface CheckoutCardProps {
  readonly id: string;
  readonly icon: IconName;
  readonly title: string;
  readonly action?: ReactNode;
  readonly children: ReactNode;
}

const FORM_ID = 'checkout-form';
const READY_MESSAGE = 'Данные заполнены. Создание заказа будет подключено отдельно.';
const ADDRESS_FALLBACK_NOTICE = 'Не удалось загрузить подсказки. Адрес можно ввести вручную.';
const CITY_MIN_QUERY_LENGTH = 2;
const STREET_MIN_QUERY_LENGTH = 1;
const HOUSE_MIN_QUERY_LENGTH = 1;
const FEDERAL_CITY_PREFIX = 'г ';
const PICKUP_CITIES = [...new Set(DEMO_STORES.map((store) => store.city))];

const DELIVERY_METHODS: readonly {
  readonly value: CheckoutDeliveryMethod;
  readonly label: string;
  readonly icon: IconName;
}[] = [
  { value: 'courier', label: 'Курьером', icon: 'package' },
  { value: 'pickup', label: 'Самовывоз', icon: 'store' },
];

function cityCaption(city: CityOption): string {
  const region = city.region.trim();

  return region === `${FEDERAL_CITY_PREFIX}${city.name.trim()}` ? '' : region;
}

function CheckoutCard({ id, icon, title, action, children }: CheckoutCardProps) {
  const heading = (
    <h2 className="checkout-card__title" id={id}>
      <Icon className="checkout-card__icon" name={icon} />
      {title}
    </h2>
  );

  return (
    <section aria-labelledby={id} className="checkout-card">
      {action === undefined ? (
        heading
      ) : (
        <div className="checkout-card__header">
          {heading}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function toManualAddress(current: CheckoutFormState): CheckoutFormState {
  return current.addressMode === 'manual'
    ? current
    : {
        ...current,
        addressMode: 'manual',
        manualFrom: null,
        cityFiasId: '',
        cityRegion: '',
        streetFiasId: '',
        houseFiasId: '',
      };
}

function errorId(field: CheckoutValidatedField): string {
  return `${checkoutControlId(field)}-error`;
}

function focusField(field: CheckoutValidatedField): void {
  const element = document.getElementById(checkoutControlId(field));

  if (element instanceof HTMLFieldSetElement) {
    const target =
      element.querySelector<HTMLInputElement>('input:checked') ??
      element.querySelector<HTMLInputElement>('input');

    target?.focus();

    return;
  }

  element?.focus();
}

export function CheckoutForm({
  lines,
  totals,
  initialCity,
  cityLookupClient,
  addressLookupClient,
  addressLookupConfigured,
}: CheckoutFormProps) {
  const [deliveryDates] = useState(() => checkoutDeliveryDates(new Date()));
  const [form, setForm] = useState<CheckoutFormState>(() =>
    initialCheckoutForm(
      initialCity,
      deliveryDates[0]?.value ?? '',
      addressLookupConfigured ? 'provider' : 'manual',
    ),
  );
  const [addressNotice, setAddressNotice] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState('');
  const [focusRequest, setFocusRequest] = useState<
    { readonly field: CheckoutValidatedField } | undefined
  >(undefined);
  const errors = submitted ? validateCheckoutForm(form) : {};
  const { cityFiasId, city, cityRegion, streetFiasId, street } = form;

  const handleLookupFailure = useCallback(() => {
    setForm(toManualAddress);
    setAddressNotice(ADDRESS_FALLBACK_NOTICE);
  }, []);

  const chooseManualAddress = () => {
    setForm(toManualAddress);
    setStatus('');
    setFocusRequest({ field: 'city' });
  };

  const searchCities = useCallback(
    (query: string, signal: AbortSignal) => cityLookupClient.searchCities(query, signal),
    [cityLookupClient],
  );

  const searchStreets = useCallback(
    (query: string, signal: AbortSignal) =>
      addressLookupClient.searchStreets(
        { fiasId: cityFiasId, name: city, region: cityRegion },
        query,
        signal,
      ),
    [addressLookupClient, cityFiasId, city, cityRegion],
  );

  const searchHouses = useCallback(
    (query: string, signal: AbortSignal) =>
      addressLookupClient.searchHouses({ fiasId: streetFiasId, label: street }, query, signal),
    [addressLookupClient, streetFiasId, street],
  );

  const updateAddress = (patch: (current: CheckoutFormState) => CheckoutFormState) => {
    setForm(patch);
    setStatus('');
  };

  const cityMode = isManualAddressLevel(form, 'city') ? 'manual' : 'provider';
  const streetMode = isManualAddressLevel(form, 'street') ? 'manual' : 'provider';
  const houseMode = isManualAddressLevel(form, 'house') ? 'manual' : 'provider';
  const streetLocked = streetMode === 'provider' && !isAddressLevelConfirmed(form, 'city');
  const houseLocked = houseMode === 'provider' && !isAddressLevelConfirmed(form, 'street');

  useEffect(() => {
    if (focusRequest !== undefined) {
      focusField(focusRequest.field);
    }
  }, [focusRequest]);

  const update = (field: keyof CheckoutFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setStatus('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateCheckoutForm(form);
    const firstInvalid = CHECKOUT_FIELD_ORDER.find((field) => nextErrors[field] !== undefined);

    setSubmitted(true);

    if (firstInvalid === undefined) {
      setForm(normalizeCheckoutForm(form));
      setStatus(READY_MESSAGE);

      return;
    }

    setStatus('');
    setFocusRequest({ field: firstInvalid });
  };

  return (
    <div className="checkout-layout">
      <form className="checkout-form" id={FORM_ID} noValidate onSubmit={handleSubmit}>
        <CheckoutCard icon="person" id="checkout-contact-title" title="Контактные данные">
          <div className="checkout-grid">
            <TextField
              autoComplete="given-name"
              error={errors.firstName}
              id={checkoutControlId('firstName')}
              label="Имя"
              maxLength={CHECKOUT_MAX_LENGTH.firstName}
              onChange={(event) => {
                update('firstName', event.currentTarget.value);
              }}
              required
              value={form.firstName}
            />
            <TextField
              autoComplete="family-name"
              error={errors.lastName}
              id={checkoutControlId('lastName')}
              label="Фамилия"
              maxLength={CHECKOUT_MAX_LENGTH.lastName}
              onChange={(event) => {
                update('lastName', event.currentTarget.value);
              }}
              required
              value={form.lastName}
            />
            <PhoneField
              autoComplete="tel"
              error={errors.phone}
              id={checkoutControlId('phone')}
              label="Телефон"
              onValueChange={(value) => {
                update('phone', value);
              }}
              required
              value={form.phone}
            />
            <TextField
              autoComplete="email"
              error={errors.email}
              id={checkoutControlId('email')}
              inputMode="email"
              label="E-mail"
              maxLength={CHECKOUT_MAX_LENGTH.email}
              onChange={(event) => {
                update('email', event.currentTarget.value);
              }}
              required
              type="email"
              value={form.email}
            />
          </div>
        </CheckoutCard>

        <CheckoutCard icon="package" id="checkout-delivery-title" title="Способ получения">
          <fieldset className="checkout-choices">
            <legend className="ui-visually-hidden">Способ получения</legend>
            {DELIVERY_METHODS.map((method) => (
              <div
                className={
                  form.deliveryMethod === method.value
                    ? 'checkout-option checkout-option--selected'
                    : 'checkout-option'
                }
                key={method.value}
              >
                <Radio
                  checked={form.deliveryMethod === method.value}
                  label={
                    <span className="checkout-option__method">
                      <Icon className="checkout-option__method-icon" name={method.icon} />
                      <span className="checkout-option__title">{method.label}</span>
                    </span>
                  }
                  name="checkout-delivery-method"
                  onChange={() => {
                    updateAddress((current) => ({ ...current, deliveryMethod: method.value }));
                  }}
                  value={method.value}
                />
              </div>
            ))}
          </fieldset>
        </CheckoutCard>

        {form.deliveryMethod === 'courier' ? (
          <>
            <CheckoutCard
              action={
                form.addressMode === 'provider' ? (
                  <button
                    className="checkout-card__action"
                    onClick={chooseManualAddress}
                    type="button"
                  >
                    Ввести адрес вручную
                  </button>
                ) : undefined
              }
              icon="map-pin"
              id="checkout-address-title"
              title="Адрес доставки"
            >
              <p className="ui-visually-hidden" role="status">
                {addressNotice}
              </p>
              {addressNotice === '' ? null : (
                <p className="checkout-address-notice">{addressNotice}</p>
              )}
              <div className="checkout-grid">
                <CheckoutAddressCombobox<CityOption>
                  error={errors.city}
                  getCaption={cityCaption}
                  getKey={(option) => option.fiasId}
                  getLabel={(option) => option.name}
                  id={checkoutControlId('city')}
                  label="Город"
                  manualAutoComplete="address-level2"
                  maxLength={CHECKOUT_MAX_LENGTH.city}
                  minQueryLength={CITY_MIN_QUERY_LENGTH}
                  mode={cityMode}
                  notFoundMessage="Город не найден."
                  onInput={(value) => {
                    updateAddress((current) => ({
                      ...current,
                      city: value,
                      cityFiasId: '',
                      cityRegion: '',
                      streetFiasId: '',
                      houseFiasId: '',
                    }));
                  }}
                  onLookupFailure={handleLookupFailure}
                  onManual={() => {
                    updateAddress((current) => ({
                      ...current,
                      manualFrom: 'city',
                      cityFiasId: '',
                      cityRegion: '',
                      streetFiasId: '',
                      houseFiasId: '',
                    }));
                  }}
                  onSelect={(option) => {
                    updateAddress((current) =>
                      current.cityFiasId === option.fiasId
                        ? current
                        : {
                            ...current,
                            city: option.name,
                            cityFiasId: option.fiasId,
                            cityRegion: option.region,
                            street: '',
                            streetFiasId: '',
                            house: '',
                            houseFiasId: '',
                            manualFrom: null,
                          },
                    );
                  }}
                  search={searchCities}
                  selected={form.cityFiasId !== ''}
                  value={form.city}
                />
                <CheckoutAddressCombobox<StreetOption>
                  disabled={streetLocked}
                  error={errors.street}
                  getKey={(option) => option.fiasId}
                  getLabel={(option) => option.label}
                  hint={streetLocked ? 'Сначала выберите город' : undefined}
                  id={checkoutControlId('street')}
                  label="Улица"
                  maxLength={CHECKOUT_MAX_LENGTH.street}
                  minQueryLength={STREET_MIN_QUERY_LENGTH}
                  mode={streetMode}
                  notFoundMessage="Улица не найдена."
                  onInput={(value) => {
                    updateAddress((current) => ({
                      ...current,
                      street: value,
                      streetFiasId: '',
                      houseFiasId: '',
                    }));
                  }}
                  onLookupFailure={handleLookupFailure}
                  onManual={() => {
                    updateAddress((current) => ({
                      ...current,
                      manualFrom: 'street',
                      streetFiasId: '',
                      houseFiasId: '',
                    }));
                  }}
                  onSelect={(option) => {
                    updateAddress((current) =>
                      current.streetFiasId === option.fiasId
                        ? current
                        : {
                            ...current,
                            street: option.label,
                            streetFiasId: option.fiasId,
                            house: '',
                            houseFiasId: '',
                            manualFrom: null,
                          },
                    );
                  }}
                  search={searchStreets}
                  selected={form.streetFiasId !== ''}
                  value={form.street}
                />
                <CheckoutAddressCombobox<HouseOption>
                  disabled={houseLocked}
                  error={errors.house}
                  getKey={(option) => option.fiasId}
                  getLabel={(option) => option.label}
                  hint={houseLocked ? 'Сначала выберите улицу' : undefined}
                  id={checkoutControlId('house')}
                  label="Дом"
                  maxLength={CHECKOUT_MAX_LENGTH.house}
                  minQueryLength={HOUSE_MIN_QUERY_LENGTH}
                  mode={houseMode}
                  notFoundMessage="Дом не найден."
                  onInput={(value) => {
                    updateAddress((current) => ({ ...current, house: value, houseFiasId: '' }));
                  }}
                  onLookupFailure={handleLookupFailure}
                  onManual={() => {
                    updateAddress((current) => ({
                      ...current,
                      manualFrom: 'house',
                      houseFiasId: '',
                    }));
                  }}
                  onSelect={(option) => {
                    updateAddress((current) => ({
                      ...current,
                      house: option.label,
                      houseFiasId: option.fiasId,
                    }));
                  }}
                  search={searchHouses}
                  selected={form.houseFiasId !== ''}
                  value={form.house}
                />
                <TextField
                  error={errors.apartment}
                  id={checkoutControlId('apartment')}
                  label="Квартира (необязательно)"
                  maxLength={CHECKOUT_MAX_LENGTH.apartment}
                  onChange={(event) => {
                    update('apartment', event.currentTarget.value);
                  }}
                  value={form.apartment}
                />
                <div className="checkout-grid__wide">
                  <TextareaField
                    hint={`До ${String(CHECKOUT_MAX_LENGTH.courierComment)} символов`}
                    id="checkout-courier-comment"
                    label="Комментарий для курьера (необязательно)"
                    maxLength={CHECKOUT_MAX_LENGTH.courierComment}
                    onChange={(event) => {
                      update('courierComment', event.currentTarget.value);
                    }}
                    placeholder="Позвонить заранее за 30 минут"
                    rows={2}
                    value={form.courierComment}
                  />
                </div>
              </div>
            </CheckoutCard>

            <CheckoutCard
              icon="calendar"
              id="checkout-schedule-title"
              title="Дата и время доставки"
            >
              <div className="checkout-schedule">
                <div className="checkout-schedule__date">
                  <SelectField
                    error={errors.deliveryDate}
                    id={checkoutControlId('deliveryDate')}
                    label="Дата"
                    onValueChange={(value) => {
                      update('deliveryDate', value);
                    }}
                    options={deliveryDates}
                    placeholder="Выберите дату"
                    required
                    value={form.deliveryDate}
                  />
                </div>
                <fieldset
                  aria-describedby={errors.deliverySlot ? errorId('deliverySlot') : undefined}
                  className="checkout-slots"
                  id={checkoutControlId('deliverySlot')}
                >
                  <legend className="checkout-slots__legend">Время</legend>
                  <div className="checkout-slots__list">
                    {CHECKOUT_DELIVERY_SLOTS.map((slot) => (
                      <label
                        className={
                          errors.deliverySlot
                            ? 'checkout-slot checkout-slot--invalid'
                            : 'checkout-slot'
                        }
                        key={slot.value}
                      >
                        <input
                          checked={form.deliverySlot === slot.value}
                          className="checkout-slot__input"
                          name="checkout-delivery-slot"
                          onChange={() => {
                            update('deliverySlot', slot.value);
                          }}
                          type="radio"
                          value={slot.value}
                        />
                        <span className="checkout-slot__label">{slot.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.deliverySlot ? (
                    <p className="ui-field__error" id={errorId('deliverySlot')}>
                      {errors.deliverySlot}
                    </p>
                  ) : null}
                </fieldset>
              </div>
            </CheckoutCard>
          </>
        ) : (
          <CheckoutCard
            action={
              PICKUP_CITIES.length === 1 ? (
                <p className="checkout-pickup__city">
                  <Icon className="checkout-pickup__city-icon" name="map-pin" />
                  <span>
                    <span className="ui-visually-hidden">Город: </span>
                    {PICKUP_CITIES[0]}
                  </span>
                </p>
              ) : undefined
            }
            icon="store"
            id="checkout-pickup-title"
            title="Магазин для самовывоза"
          >
            <fieldset
              aria-describedby={errors.pickupStore ? errorId('pickupStore') : undefined}
              className="checkout-pickup"
              id={checkoutControlId('pickupStore')}
            >
              <legend className="ui-visually-hidden">Магазин для самовывоза</legend>
              <div className="checkout-pickup__list">
                {DEMO_STORES.map((store) => (
                  <div
                    className={
                      form.pickupStoreId === store.id
                        ? 'checkout-option checkout-option--store checkout-option--selected'
                        : 'checkout-option checkout-option--store'
                    }
                    key={store.id}
                  >
                    <Radio
                      checked={form.pickupStoreId === store.id}
                      label={
                        <span className="checkout-store">
                          <span className="checkout-store__name">{store.name}</span>
                          <span className="checkout-store__meta">
                            <span className="ui-visually-hidden">Адрес: </span>
                            {store.address}
                          </span>
                          {store.metro === undefined ? null : (
                            <span className="checkout-store__meta">
                              <span aria-hidden="true" className="checkout-store__metro-mark">
                                М
                              </span>
                              <span className="ui-visually-hidden">Метро: </span>
                              {store.metro}
                            </span>
                          )}
                          <span className="checkout-store__meta">
                            <span className="ui-visually-hidden">Часы работы магазина: </span>
                            {store.hours}
                          </span>
                        </span>
                      }
                      name="checkout-pickup-store"
                      onChange={() => {
                        updateAddress((current) => ({ ...current, pickupStoreId: store.id }));
                      }}
                      value={store.id}
                    />
                  </div>
                ))}
              </div>
              {errors.pickupStore ? (
                <p className="ui-field__error" id={errorId('pickupStore')}>
                  {errors.pickupStore}
                </p>
              ) : null}
            </fieldset>
          </CheckoutCard>
        )}

        <CheckoutCard icon="scan-qr" id="checkout-payment-title" title="Способ оплаты">
          <fieldset
            aria-describedby={errors.payment ? errorId('payment') : undefined}
            className="checkout-choices checkout-choices--stacked"
            id={checkoutControlId('payment')}
          >
            <legend className="ui-visually-hidden">Способ оплаты</legend>
            {CHECKOUT_PAYMENT_METHODS.map((method) => (
              <div
                className={
                  form.payment === method.value
                    ? 'checkout-option checkout-option--compact checkout-option--selected'
                    : 'checkout-option checkout-option--compact'
                }
                key={method.value}
              >
                <Radio
                  checked={form.payment === method.value}
                  label={
                    <span className="checkout-option__content checkout-option__content--inline">
                      <span className="checkout-option__title">{method.label}</span>
                      {method.marks.length === 0 ? null : (
                        <span className="checkout-option__marks">
                          {method.marks.map((mark) => (
                            <img
                              alt={mark.alt}
                              className={`checkout-option__mark checkout-option__mark--${mark.modifier}`}
                              key={mark.modifier}
                              src={mark.src}
                            />
                          ))}
                        </span>
                      )}
                    </span>
                  }
                  name="checkout-payment"
                  onChange={() => {
                    update('payment', method.value);
                  }}
                  value={method.value}
                />
              </div>
            ))}
            {errors.payment ? (
              <p className="ui-field__error" id={errorId('payment')}>
                {errors.payment}
              </p>
            ) : null}
          </fieldset>
        </CheckoutCard>

        <CheckoutCard icon="edit" id="checkout-comment-title" title="Комментарий к заказу">
          <TextareaField
            hint={`До ${String(CHECKOUT_MAX_LENGTH.orderComment)} символов`}
            id="checkout-order-comment"
            label="Комментарий (необязательно)"
            maxLength={CHECKOUT_MAX_LENGTH.orderComment}
            onChange={(event) => {
              update('orderComment', event.currentTarget.value);
            }}
            placeholder="Ваш комментарий"
            rows={3}
            value={form.orderComment}
          />
        </CheckoutCard>
      </form>

      <CheckoutOrderSummary
        formId={FORM_ID}
        lines={lines}
        pickupStore={form.deliveryMethod === 'pickup' ? findStore(form.pickupStoreId) : undefined}
        status={status}
        totals={totals}
      />

      <div className="checkout-benefits">
        <BenefitsStrip items={CHECKOUT_BENEFITS} label="Преимущества GoodCall" />
      </div>
    </div>
  );
}
