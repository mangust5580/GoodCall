import { useId } from 'react';
import type { FormEvent } from 'react';

import newsletterGift from '../../assets/marketing/newsletter-gift.svg';
import { Container } from '../layout';
import { Button, Icon } from '../ui';

export interface NewsletterBandProps {
  readonly onSubscribe?: (email: string) => void;
}

export function NewsletterBand({ onSubscribe }: NewsletterBandProps) {
  const titleId = useId();
  const emailId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = new FormData(event.currentTarget).get('email');

    if (typeof email !== 'string') {
      return;
    }

    onSubscribe?.(email.trim());
  };

  return (
    <section aria-labelledby={titleId} className="newsletter-band">
      <Container>
        <div className="newsletter-band__content">
          <div className="newsletter-band__lead">
            <span className="newsletter-band__motif">
              <Icon name="mail" />
            </span>
            <div className="newsletter-band__copy">
              <h2 className="newsletter-band__title" id={titleId}>
                Будьте в курсе новинок и акций
              </h2>
              <p className="newsletter-band__description">
                Подпишитесь на наши новости и получайте эксклюзивные предложения
              </p>
            </div>
          </div>
          <form className="newsletter-band__form" onSubmit={handleSubmit}>
            <label className="ui-visually-hidden" htmlFor={emailId}>
              Электронная почта
            </label>
            <input
              autoComplete="email"
              className="ui-input newsletter-band__input"
              id={emailId}
              inputMode="email"
              name="email"
              placeholder="Ваш e-mail"
              required
              type="email"
            />
            <Button className="newsletter-band__submit" type="submit" variant="primary">
              Подписаться
            </Button>
          </form>
          <img alt="" aria-hidden="true" className="newsletter-band__art" src={newsletterGift} />
        </div>
      </Container>
    </section>
  );
}
