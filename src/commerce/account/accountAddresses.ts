export interface DemoAccountAddress {
  readonly id: string;
  readonly recipientName: string;
  readonly phone: string;
  readonly city: string;
  readonly addressLine: string;
  readonly postalCode?: string;
}

export type AccountAddressInput = Omit<DemoAccountAddress, 'id' | 'postalCode'> & {
  readonly postalCode: string;
};

export type AccountAddressField = keyof AccountAddressInput;

export type AccountAddressErrors = Partial<Record<AccountAddressField, string>>;

export interface AccountAddressBook {
  readonly addresses: readonly DemoAccountAddress[];
  readonly defaultAddressId?: string;
}

export const ACCOUNT_ADDRESS_LIMIT = 5;
export const ACCOUNT_ADDRESS_LINE_MAX_LENGTH = 200;

const PHONE_PATTERN = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
const PERSON_NAME_PATTERN = /^\p{L}[\p{L}\p{M}]*(?:[ '’-]\p{L}[\p{L}\p{M}]*)*$/u;
const PLACE_NAME_PATTERN = /^\p{L}[\p{L}\p{M}]*(?:(?:[ '’-]|\. ?)\p{L}[\p{L}\p{M}]*)*$/u;
const HAS_LETTER = /\p{L}/u;
const HAS_DIGIT = /\d/;
const POSTAL_CODE_PATTERN = /^\d{6}$/;
const ID_BYTES = 16;

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/gu, ' ');
}

export function normalizeAccountAddressInput(input: AccountAddressInput): AccountAddressInput {
  return {
    recipientName: normalizeText(input.recipientName),
    phone: input.phone.trim(),
    city: normalizeText(input.city),
    addressLine: normalizeText(input.addressLine),
    postalCode: input.postalCode.trim(),
  };
}

export function accountAddressErrors(input: AccountAddressInput): AccountAddressErrors {
  const normalized = normalizeAccountAddressInput(input);
  const errors: AccountAddressErrors = {};

  if (normalized.recipientName === '') {
    errors.recipientName = 'Укажите получателя';
  } else if (!PERSON_NAME_PATTERN.test(normalized.recipientName)) {
    errors.recipientName = 'Имя получателя может содержать буквы, пробел, дефис и апостроф';
  }

  if (normalized.phone === '') {
    errors.phone = 'Укажите номер телефона';
  } else if (!PHONE_PATTERN.test(normalized.phone)) {
    errors.phone = 'Введите номер полностью: +7 (XXX) XXX-XX-XX';
  }

  if (normalized.city === '') {
    errors.city = 'Укажите город';
  } else if (!PLACE_NAME_PATTERN.test(normalized.city)) {
    errors.city = 'Название города может содержать буквы, пробел, дефис и точку';
  }

  if (
    normalized.addressLine === '' ||
    !HAS_LETTER.test(normalized.addressLine) ||
    !HAS_DIGIT.test(normalized.addressLine)
  ) {
    errors.addressLine = 'Укажите улицу, дом и квартиру';
  } else if (normalized.addressLine.length > ACCOUNT_ADDRESS_LINE_MAX_LENGTH) {
    errors.addressLine = 'Адрес должен быть не длиннее 200 символов';
  }

  if (normalized.postalCode !== '' && !POSTAL_CODE_PATTERN.test(normalized.postalCode)) {
    errors.postalCode = 'Индекс состоит из 6 цифр';
  }

  return errors;
}

export function toAccountAddress(id: string, input: AccountAddressInput): DemoAccountAddress {
  const normalized = normalizeAccountAddressInput(input);
  const base = {
    id,
    recipientName: normalized.recipientName,
    phone: normalized.phone,
    city: normalized.city,
    addressLine: normalized.addressLine,
  };

  return normalized.postalCode === '' ? base : { ...base, postalCode: normalized.postalCode };
}

export function accountAddressInput(address: DemoAccountAddress): AccountAddressInput {
  return {
    recipientName: address.recipientName,
    phone: address.phone,
    city: address.city,
    addressLine: address.addressLine,
    postalCode: address.postalCode ?? '',
  };
}

function toStoredAddress(value: unknown): DemoAccountAddress | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }

  const { id, recipientName, phone, city, addressLine, postalCode } = value as Record<
    string,
    unknown
  >;

  if (
    typeof id !== 'string' ||
    id.trim() === '' ||
    typeof recipientName !== 'string' ||
    typeof phone !== 'string' ||
    typeof city !== 'string' ||
    typeof addressLine !== 'string' ||
    (postalCode !== undefined && typeof postalCode !== 'string')
  ) {
    return undefined;
  }

  const input = { recipientName, phone, city, addressLine, postalCode: postalCode ?? '' };

  return Object.keys(accountAddressErrors(input)).length === 0
    ? toAccountAddress(id, input)
    : undefined;
}

export function withDefaultAddress(
  addresses: readonly DemoAccountAddress[],
  defaultAddressId: string | undefined,
): AccountAddressBook {
  const first = addresses[0];

  if (first === undefined) {
    return { addresses: [] };
  }

  const matches = addresses.some((address) => address.id === defaultAddressId);

  return { addresses, defaultAddressId: matches ? defaultAddressId : first.id };
}

export function readStoredAddressBook(
  rawAddresses: unknown,
  rawDefault: unknown,
): AccountAddressBook {
  if (!Array.isArray(rawAddresses)) {
    return { addresses: [] };
  }

  const addresses: DemoAccountAddress[] = [];
  const ids = new Set<string>();

  for (const entry of rawAddresses) {
    const address = toStoredAddress(entry);

    if (address === undefined || ids.has(address.id)) {
      continue;
    }

    if (addresses.length >= ACCOUNT_ADDRESS_LIMIT) {
      break;
    }

    ids.add(address.id);
    addresses.push(address);
  }

  return withDefaultAddress(addresses, typeof rawDefault === 'string' ? rawDefault : undefined);
}

function randomId(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return Array.from(crypto.getRandomValues(new Uint8Array(ID_BYTES)), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

export function createAccountAddressId(existing: readonly DemoAccountAddress[]): string {
  let id = randomId();

  while (existing.some((address) => address.id === id)) {
    id = randomId();
  }

  return id;
}
