import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './SiteFooter.module.scss';
import { PageContainer } from '@/shared/ui';
import { BrandHomeLink } from '@/app/shell/brand';
import { company } from '@/app/content/company';
import { FooterLinkGroup } from './FooterLinkGroup';
import { footerGroups, footerLegalLinks } from './footer-navigation';
import {
  FOOTER_CONTACTS_TITLE,
  FOOTER_LEGAL_NAV_LABEL,
  FOOTER_OFFICE_HOURS_TITLE,
  FOOTER_OFFICE_TITLE,
  FOOTER_PAYMENT_INDICATORS,
  FOOTER_PAYMENT_TITLE,
  FOOTER_SUPPORT_EMAIL_TITLE,
  FOOTER_SUPPORT_HOURS_TITLE,
  FOOTER_SUPPORT_PHONE_TITLE,
  footerCopyright,
} from './footer-content';

export function SiteFooter(): React.ReactElement {
  const brandLinkClassName = styles['brand-link'] ?? '';
  const contactsTitleId = React.useId();
  const paymentTitleId = React.useId();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles['site-footer']}>
      <PageContainer className={styles['inner']}>
        <div className={styles['brand']}>
          <BrandHomeLink className={brandLinkClassName} />
          <p className={styles['descriptor']}>{company.descriptor}</p>
        </div>

        {footerGroups.map((group) => (
          <FooterLinkGroup key={group.id} group={group} />
        ))}

        <div className={styles['contacts']}>
          <h2 id={contactsTitleId} className={styles['group-title']}>
            {FOOTER_CONTACTS_TITLE}
          </h2>
          <dl className={styles['contact-list']}>
            <dt className={styles['contact-term']}>{FOOTER_SUPPORT_PHONE_TITLE}</dt>
            <dd className={styles['contact-value']}>
              <a href={company.supportPhoneHref} className={styles['link']}>
                {company.supportPhone}
              </a>
            </dd>

            <dt className={styles['contact-term']}>{FOOTER_SUPPORT_EMAIL_TITLE}</dt>
            <dd className={styles['contact-value']}>
              <a href={company.supportEmailHref} className={styles['link']}>
                {company.supportEmail}
              </a>
            </dd>

            <dt className={styles['contact-term']}>{FOOTER_SUPPORT_HOURS_TITLE}</dt>
            <dd className={styles['contact-value']}>{company.supportHours}</dd>

            <dt className={styles['contact-term']}>{FOOTER_OFFICE_TITLE}</dt>
            <dd className={styles['contact-value']}>
              <address className={styles['address']}>{company.headOffice}</address>
            </dd>

            <dt className={styles['contact-term']}>{FOOTER_OFFICE_HOURS_TITLE}</dt>
            <dd className={styles['contact-value']}>{company.officeHours}</dd>
          </dl>
        </div>
      </PageContainer>

      <div className={styles['utility']}>
        <PageContainer className={styles['utility-inner']}>
          <div className={styles['payment']}>
            <h2 id={paymentTitleId} className={styles['utility-title']}>
              {FOOTER_PAYMENT_TITLE}
            </h2>
            <ul className={styles['payment-list']}>
              {FOOTER_PAYMENT_INDICATORS.map((indicator) => (
                <li key={indicator} className={styles['payment-item']}>
                  {indicator}
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label={FOOTER_LEGAL_NAV_LABEL} className={styles['legal']}>
            <ul className={styles['legal-list']}>
              {footerLegalLinks.map((link) => (
                <li key={link.routeKey} className={styles['legal-item']}>
                  <NavLink
                    to={link.path}
                    end
                    className={({ isActive }) =>
                      isActive ? `${styles['link']} ${styles['link-current']}` : styles['link']
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <p className={styles['copyright']}>{footerCopyright(currentYear)}</p>
        </PageContainer>
      </div>
    </footer>
  );
}
