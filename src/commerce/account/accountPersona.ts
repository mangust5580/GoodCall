export type DemoAccountGender = 'unspecified' | 'male' | 'female';

export interface DemoAccountProfile {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string;
  readonly birthDate: string;
  readonly gender: DemoAccountGender;
}

export const DEMO_ACCOUNT_PERSONA: DemoAccountProfile = {
  firstName: 'Иван',
  lastName: 'Иванов',
  email: 'demo@goodcall.example',
  phone: '+7 (900) 000-00-00',
  birthDate: '1996-04-12',
  gender: 'unspecified',
};
