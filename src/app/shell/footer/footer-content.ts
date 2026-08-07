export const FOOTER_CONTACTS_TITLE = 'Контакты';

export const FOOTER_LEGAL_NAV_LABEL = 'Правовая информация';

export const FOOTER_PAYMENT_TITLE = 'Демонстрационные способы оплаты';

export const FOOTER_PAYMENT_INDICATORS: readonly string[] = [
  'Visa •••• 4242',
  'Mastercard •••• 8888',
];

export const FOOTER_SUPPORT_PHONE_TITLE = 'Телефон поддержки';

export const FOOTER_SUPPORT_EMAIL_TITLE = 'Электронная почта';

export const FOOTER_SUPPORT_HOURS_TITLE = 'Поддержка';

export const FOOTER_OFFICE_TITLE = 'Головной офис';

export const FOOTER_OFFICE_HOURS_TITLE = 'Часы работы офиса';

export function footerCopyright(year: number): string {
  return `© ${String(year)} GoodCall. Все права защищены.`;
}

export function footerDisclosureLabel(title: string, expanded: boolean): string {
  return expanded ? `Скрыть раздел «${title}»` : `Показать раздел «${title}»`;
}
