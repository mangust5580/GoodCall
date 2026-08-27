import paymentMir from '../../assets/commerce/payment-mir.svg';
import { BrandLogo } from '../brand';
import { Container } from '../layout';
import { Icon } from '../ui';

export interface SiteFooterProps {
  readonly homeHref?: string;
}

interface FooterGroup {
  readonly title: string;
  readonly items: readonly string[];
}

const FOOTER_GROUPS: readonly FooterGroup[] = [
  {
    title: 'Покупателям',
    items: ['Доставка и оплата', 'Гарантия и возврат', 'FAQ', 'Бонусная программа'],
  },
  {
    title: 'Компания',
    items: ['О нас', 'Контакты', 'Новости', 'Карьера'],
  },
  {
    title: 'Помощь',
    items: ['Поддержка 24/7', 'Статус заказа', 'Сервисные центры'],
  },
];

const LEGAL_ITEMS: readonly string[] = [
  'Политика конфиденциальности',
  'Пользовательское соглашение',
  'Публичная оферта',
];

const SUPPORT_PHONE = '8 800 100-10-10';
const SUPPORT_PHONE_HREF = 'tel:+78001001010';
const SUPPORT_EMAIL = 'info@goodcall.ru';

export function SiteFooter({ homeHref }: SiteFooterProps) {
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
          </div>

          {FOOTER_GROUPS.map((group) => (
            <div className="site-footer__group" key={group.title}>
              <h2 className="site-footer__group-title">{group.title}</h2>
              <ul className="site-footer__group-list">
                {group.items.map((item) => (
                  <li className="site-footer__group-item" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="site-footer__contacts">
            <h2 className="ui-visually-hidden">Контакты</h2>
            <div className="site-footer__contact">
              <span className="site-footer__contact-tile">
                <Icon name="phone" />
              </span>
              <a className="site-footer__contact-value" href={SUPPORT_PHONE_HREF}>
                {SUPPORT_PHONE}
              </a>
              <span className="site-footer__contact-note">Звонок по России бесплатный</span>
            </div>
            <div className="site-footer__contact">
              <span className="site-footer__contact-tile">
                <Icon name="mail" />
              </span>
              <a className="site-footer__contact-value" href={`mailto:${SUPPORT_EMAIL}`}>
                {SUPPORT_EMAIL}
              </a>
              <span className="site-footer__contact-note">Ежедневно с 9:00 до 21:00</span>
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
          <ul className="site-footer__payments">
            <li>
              <img alt="МИР" className="site-footer__payment-mark" src={paymentMir} />
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
