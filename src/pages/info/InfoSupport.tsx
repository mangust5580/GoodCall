import { STOREFRONT_SUPPORT } from '../../commerce/storefront';
import { Icon } from '../../components/ui';
import { InfoIllustration } from './InfoParts';

export interface InfoSupportLink {
  readonly label: string;
  readonly href: string;
}

interface InfoSupportProps {
  readonly titleId: string;
  readonly title: string;
  readonly text: string;
  readonly links: readonly InfoSupportLink[];
}

export function InfoSupport({ titleId, title, text, links }: InfoSupportProps) {
  return (
    <section aria-labelledby={titleId} className="info-support">
      <InfoIllustration icon="headset" size="md" />
      <div className="info-support__intro">
        <h2 className="info-support__title" id={titleId}>
          {title}
        </h2>
        <p className="info-support__text">{text}</p>
      </div>
      <ul aria-label="Контакты поддержки" className="info-support__contacts">
        <li className="info-support__contact">
          <span className="info-support__contact-tile">
            <Icon name="phone" />
          </span>
          <span className="info-support__contact-body">
            <a className="info-support__contact-value" href={STOREFRONT_SUPPORT.phoneHref}>
              {STOREFRONT_SUPPORT.phone}
            </a>
            <span className="info-support__contact-note">{STOREFRONT_SUPPORT.hours}</span>
          </span>
        </li>
        <li className="info-support__contact">
          <span className="info-support__contact-tile">
            <Icon name="mail" />
          </span>
          <span className="info-support__contact-body">
            <a className="info-support__contact-value" href={STOREFRONT_SUPPORT.emailHref}>
              {STOREFRONT_SUPPORT.email}
            </a>
            <span className="info-support__contact-note">Вопросы по заказам и гарантии</span>
          </span>
        </li>
      </ul>
      <div className="info-support__actions">
        {links.map((link, index) => (
          <a
            className={`ui-button ui-button--${index === 0 ? 'primary' : 'secondary'} info-support__action`}
            href={link.href}
            key={link.href}
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
