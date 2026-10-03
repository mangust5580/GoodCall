import paymentMir from '../../assets/commerce/payment-mir.svg';
import paymentSberpay from '../../assets/commerce/payment-sberpay.svg';
import paymentSbp from '../../assets/commerce/payment-sbp.svg';
import paymentTpay from '../../assets/commerce/payment-tpay.svg';
import socialRutube from '../../assets/social/rutube.svg';
import socialTelegram from '../../assets/social/telegram.svg';
import socialVk from '../../assets/social/vk.svg';
import socialYoutube from '../../assets/social/youtube.svg';
import { BrandLogo } from '../brand';
import { Container } from '../layout';
import { Icon } from '../ui';

export interface SiteFooterHelpLinks {
  readonly delivery?: string;
  readonly warranty?: string;
  readonly faq?: string;
}

export interface SiteFooterPaymentMark {
  readonly name: string;
  readonly src: string;
  readonly modifier: string;
}

export interface SiteFooterSupport {
  readonly phone: string;
  readonly phoneHref: string;
  readonly email: string;
  readonly emailHref: string;
  readonly hours: string;
}

export interface SiteFooterProps {
  readonly homeHref?: string;
  readonly helpLinks?: SiteFooterHelpLinks;
  readonly paymentMarks?: readonly SiteFooterPaymentMark[];
  readonly support?: SiteFooterSupport;
}

interface FooterItem {
  readonly label: string;
  readonly link?: keyof SiteFooterHelpLinks;
}

interface FooterGroup {
  readonly title: string;
  readonly items: readonly FooterItem[];
}

const FOOTER_GROUPS: readonly FooterGroup[] = [
  {
    title: 'Покупателям',
    items: [
      { label: 'Доставка и оплата', link: 'delivery' },
      { label: 'Гарантия и возврат', link: 'warranty' },
      { label: 'FAQ', link: 'faq' },
      { label: 'Бонусная программа' },
    ],
  },
  {
    title: 'Компания',
    items: [{ label: 'О нас' }, { label: 'Контакты' }, { label: 'Новости' }, { label: 'Карьера' }],
  },
  {
    title: 'Помощь',
    items: [{ label: 'Поддержка 24/7' }, { label: 'Статус заказа' }, { label: 'Сервисные центры' }],
  },
];

interface BrandMark {
  readonly name: string;
  readonly src: string;
}

const SOCIAL_MARKS: readonly BrandMark[] = [
  { name: 'VK', src: socialVk },
  { name: 'Telegram', src: socialTelegram },
  { name: 'YouTube', src: socialYoutube },
  { name: 'RUTUBE', src: socialRutube },
];

const PAYMENT_MARKS: readonly SiteFooterPaymentMark[] = [
  { name: 'МИР', src: paymentMir, modifier: 'mir' },
  { name: 'СБП', src: paymentSbp, modifier: 'sbp' },
  { name: 'SberPay', src: paymentSberpay, modifier: 'sberpay' },
  { name: 'T-Pay', src: paymentTpay, modifier: 'tpay' },
];

const LEGAL_ITEMS: readonly string[] = [
  'Политика конфиденциальности',
  'Пользовательское соглашение',
  'Публичная оферта',
];

const SUPPORT: SiteFooterSupport = {
  phone: '8 800 100-10-10',
  phoneHref: 'tel:+78001001010',
  email: 'info@goodcall.ru',
  emailHref: 'mailto:info@goodcall.ru',
  hours: 'Ежедневно с 9:00 до 21:00',
};

export function SiteFooter({
  homeHref,
  helpLinks,
  paymentMarks = PAYMENT_MARKS,
  support = SUPPORT,
}: SiteFooterProps) {
  const home = homeHref ?? import.meta.env.BASE_URL;

  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__main">
          <div className="site-footer__brand-block">
            <a className="site-footer__brand" href={home}>
              <BrandLogo />
            </a>
            <p className="site-footer__tagline">Ваш надёжный магазин электроники и гаджетов</p>
            <ul aria-label="Мы в соцсетях" className="site-footer__socials">
              {SOCIAL_MARKS.map((mark) => (
                <li key={mark.name}>
                  <img alt={mark.name} className="site-footer__social-mark" src={mark.src} />
                </li>
              ))}
            </ul>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <div className="site-footer__group" key={group.title}>
              <h2 className="site-footer__group-title">{group.title}</h2>
              <ul className="site-footer__group-list">
                {group.items.map((item) => {
                  const href = item.link === undefined ? undefined : helpLinks?.[item.link];

                  return (
                    <li className="site-footer__group-item" key={item.label}>
                      {href === undefined ? (
                        item.label
                      ) : (
                        <a className="site-footer__group-link" href={href}>
                          {item.label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div className="site-footer__contacts">
            <h2 className="ui-visually-hidden">Контакты</h2>
            <div className="site-footer__contact">
              <span className="site-footer__contact-tile">
                <Icon name="phone" />
              </span>
              <a className="site-footer__contact-value" href={support.phoneHref}>
                {support.phone}
              </a>
              <span className="site-footer__contact-note">Звонок по России бесплатный</span>
            </div>
            <div className="site-footer__contact">
              <span className="site-footer__contact-tile">
                <Icon name="mail" />
              </span>
              <a className="site-footer__contact-value" href={support.emailHref}>
                {support.email}
              </a>
              <span className="site-footer__contact-note">{support.hours}</span>
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p className="site-footer__copyright">© 2024 GOODCALL. Все права защищены</p>
          <ul className="site-footer__legal">
            {LEGAL_ITEMS.map((item) => (
              <li className="site-footer__legal-item" key={item}>
                {item}
              </li>
            ))}
          </ul>
          <ul aria-label="Способы оплаты" className="site-footer__payments">
            {paymentMarks.map((mark) => (
              <li className="site-footer__payment" key={mark.name}>
                <img
                  alt={mark.name}
                  className={`site-footer__payment-mark site-footer__payment-mark--${mark.modifier}`}
                  src={mark.src}
                />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
