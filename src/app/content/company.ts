export const COMPANY_FIXTURE_ID = 'COMPANY-001';

export interface CompanyContent {
  fixtureId: string;
  brandName: string;
  displayName: string;
  descriptor: string;
  mission: string;
  headOffice: string;
  officeHours: string;
  supportPhone: string;
  supportPhoneHref: string;
  supportEmail: string;
  supportEmailHref: string;
  supportHours: string;
  socialLinks: readonly never[];
}

const SUPPORT_PHONE = '8 800 100-10-10';
const SUPPORT_EMAIL = 'info@goodcall.ru';

function telHref(displayPhone: string): string {
  return `tel:${displayPhone.replace(/\D/g, '')}`;
}

export const company: CompanyContent = {
  fixtureId: COMPANY_FIXTURE_ID,
  brandName: 'GoodCall',
  displayName: 'Интернет-магазин электроники GoodCall',
  descriptor:
    'Интернет-магазин электроники и аксессуаров с доставкой, самовывозом и поддержкой после покупки.',
  mission: 'Сделать выбор и покупку техники понятными и удобными.',
  headOffice: '123112, г. Москва, Пресненская наб., д. 8, стр. 1, офис 45-12',
  officeHours: 'Пн–Пт, 09:00–18:00',
  supportPhone: SUPPORT_PHONE,
  supportPhoneHref: telHref(SUPPORT_PHONE),
  supportEmail: SUPPORT_EMAIL,
  supportEmailHref: `mailto:${SUPPORT_EMAIL}`,
  supportHours: 'Ежедневно, 09:00–21:00',
  socialLinks: [],
};
