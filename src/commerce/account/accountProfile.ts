import type { DemoAccountGender, DemoAccountProfile } from './accountPersona';

export type AccountProfileField = keyof DemoAccountProfile;

export type AccountProfileErrors = Partial<Record<AccountProfileField, string>>;

export const ACCOUNT_GENDER_OPTIONS: readonly {
  readonly value: DemoAccountGender;
  readonly label: string;
}[] = [
  { value: 'unspecified', label: 'Не указан' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
];

export const ACCOUNT_BIRTH_DATE_MIN = '1900-01-01';

const PHONE_PATTERN = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PERSON_NAME_PATTERN = /^\p{L}[\p{L}\p{M}]*(?:[ '’-]\p{L}[\p{L}\p{M}]*)*$/u;
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const NAME_HINT = 'может содержать буквы, пробел, дефис и апостроф';

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/gu, ' ');
}

function isGender(value: unknown): value is DemoAccountGender {
  return ACCOUNT_GENDER_OPTIONS.some((option) => option.value === value);
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function todayIsoDate(now: Date = new Date()): string {
  return `${String(now.getFullYear())}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function isCalendarDate(value: string): boolean {
  const match = ISO_DATE_PATTERN.exec(value);

  if (match === null) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);

  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
}

function nameError(value: string, missing: string, invalid: string): string | undefined {
  if (value === '') {
    return missing;
  }

  return PERSON_NAME_PATTERN.test(value) ? undefined : invalid;
}

export function normalizeAccountProfile(profile: DemoAccountProfile): DemoAccountProfile {
  return {
    firstName: normalizeText(profile.firstName),
    lastName: normalizeText(profile.lastName),
    email: profile.email.trim(),
    phone: profile.phone.trim(),
    birthDate: profile.birthDate.trim(),
    gender: profile.gender,
  };
}

export function accountProfileErrors(
  profile: DemoAccountProfile,
  today: string = todayIsoDate(),
): AccountProfileErrors {
  const normalized = normalizeAccountProfile(profile);
  const errors: AccountProfileErrors = {};

  const firstName = nameError(normalized.firstName, 'Укажите имя', `Имя ${NAME_HINT}`);
  const lastName = nameError(normalized.lastName, 'Укажите фамилию', `Фамилия ${NAME_HINT}`);

  if (firstName !== undefined) {
    errors.firstName = firstName;
  }

  if (lastName !== undefined) {
    errors.lastName = lastName;
  }

  if (normalized.email === '') {
    errors.email = 'Укажите e-mail';
  } else if (!EMAIL_PATTERN.test(normalized.email)) {
    errors.email = 'Проверьте e-mail: например, name@example.ru';
  }

  if (normalized.phone === '') {
    errors.phone = 'Укажите номер телефона';
  } else if (!PHONE_PATTERN.test(normalized.phone)) {
    errors.phone = 'Введите номер полностью: +7 (XXX) XXX-XX-XX';
  }

  if (normalized.birthDate === '') {
    errors.birthDate = 'Укажите дату рождения';
  } else if (
    !isCalendarDate(normalized.birthDate) ||
    normalized.birthDate < ACCOUNT_BIRTH_DATE_MIN
  ) {
    errors.birthDate = 'Укажите корректную дату рождения';
  } else if (normalized.birthDate > today) {
    errors.birthDate = 'Укажите дату не позже сегодняшней';
  }

  if (!isGender(normalized.gender)) {
    errors.gender = 'Выберите вариант из списка';
  }

  return errors;
}

export function toStoredAccountProfile(value: unknown): DemoAccountProfile | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }

  const { firstName, lastName, email, phone, birthDate, gender } = value as Record<string, unknown>;

  if (
    typeof firstName !== 'string' ||
    typeof lastName !== 'string' ||
    typeof email !== 'string' ||
    typeof phone !== 'string' ||
    typeof birthDate !== 'string' ||
    !isGender(gender)
  ) {
    return undefined;
  }

  const profile = normalizeAccountProfile({ firstName, lastName, email, phone, birthDate, gender });

  return Object.keys(accountProfileErrors(profile)).length === 0 ? profile : undefined;
}

export function formatAccountBirthDate(isoDate: string): string {
  const match = ISO_DATE_PATTERN.exec(isoDate);

  return match === null ? isoDate : `${match[3] ?? ''}.${match[2] ?? ''}.${match[1] ?? ''}`;
}
