import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { COMPANY_FIXTURE_ID, company } from '@/app/content/company';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const companySource = fs.readFileSync(
  path.join(repoRoot, 'src', 'app', 'content', 'company.ts'),
  'utf-8'
);

describe('COMPANY-001 content owner', () => {
  it('declares a stable fixture identity', () => {
    expect(COMPANY_FIXTURE_ID).toBe('COMPANY-001');
    expect(company.fixtureId).toBe('COMPANY-001');
  });

  it('uses the exact canonical brand and display names', () => {
    expect(company.brandName).toBe('GoodCall');
    expect(company.displayName).toBe('Интернет-магазин электроники GoodCall');
  });

  it('uses the exact canonical descriptor', () => {
    expect(company.descriptor).toBe(
      'Интернет-магазин электроники и аксессуаров с доставкой, самовывозом и поддержкой после покупки.'
    );
  });

  it('uses the exact canonical mission', () => {
    expect(company.mission).toBe('Сделать выбор и покупку техники понятными и удобными.');
  });

  it('uses the exact canonical head office and office hours', () => {
    expect(company.headOffice).toBe(
      '123112, г. Москва, Пресненская наб., д. 8, стр. 1, офис 45-12'
    );
    expect(company.officeHours).toBe('Пн–Пт, 09:00–18:00');
  });

  it('uses the exact canonical support phone and derives a digits-only tel URI', () => {
    expect(company.supportPhone).toBe('8 800 100-10-10');
    expect(company.supportPhoneHref).toBe('tel:88001001010');
  });

  it('uses the exact canonical support email and a mailto URI', () => {
    expect(company.supportEmail).toBe('info@goodcall.ru');
    expect(company.supportEmailHref).toBe('mailto:info@goodcall.ru');
  });

  it('uses the exact canonical support hours', () => {
    expect(company.supportHours).toBe('Ежедневно, 09:00–21:00');
  });

  it('declares no active social links', () => {
    expect(company.socialLinks).toEqual([]);
  });

  it('makes no unapproved company claim', () => {
    for (const forbidden of [
      '24/7',
      'круглосуточно',
      'основан',
      'дистрибьютор',
      'партнёр',
      'клиентов',
      'vk.com',
      't.me',
      'youtube',
    ]) {
      expect(companySource.toLowerCase()).not.toContain(forbidden.toLowerCase());
    }
  });

  it('performs no remote content loading', () => {
    for (const forbidden of ['fetch(', 'axios', 'supabase', 'useQuery', 'msw']) {
      expect(companySource).not.toContain(forbidden);
    }
  });
});
