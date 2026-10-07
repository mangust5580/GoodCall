export interface DemoAccountPersona {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string;
  readonly birthDate: string;
}

export const DEMO_ACCOUNT_PERSONA: DemoAccountPersona = {
  firstName: 'Иван',
  lastName: 'Иванов',
  email: 'demo@goodcall.example',
  phone: '+7 (900) 000-00-00',
  birthDate: '12.04.1996',
};
