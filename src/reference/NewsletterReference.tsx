import { useState } from 'react';

import { Container } from '../components/layout';
import { NewsletterBand } from '../components/shell';
import { referenceUrl } from './referenceUrl';

import './NewsletterReference.scss';

export function NewsletterReference() {
  const index = referenceUrl('index');
  const [lastEmail, setLastEmail] = useState('');

  return (
    <main className="newsletter-reference">
      <Container className="newsletter-reference__inner">
        <h1 className="newsletter-reference__title">Global Shell / NewsletterBand</h1>
        <p className="newsletter-reference__note">
          Temporary development reference for the canonical GoodCall pre-footer newsletter region.
          The band below this block is the real production <code>NewsletterBand</code>: one
          full-width section whose violet promotional surface and content both align to the accepted
          Container. The gift artwork is decorative and hidden from assistive technology.
        </p>
        <p className="newsletter-reference__note">
          It is a real form with a native <code>type=&quot;email&quot;</code> input, a visually
          hidden label and a real submit button. Browser-native validation gates submission; there
          is no subscription backend, network request, persistence, loading state or success UI.
          Footer is not implemented.
        </p>
      </Container>

      <NewsletterBand onSubscribe={setLastEmail} />

      <Container className="newsletter-reference__inner">
        <p aria-live="polite" className="newsletter-reference__status">
          {lastEmail ? `Отправлено: ${lastEmail}` : 'Подписка ещё не отправлена'}
        </p>
        <p className="newsletter-reference__note">
          The line above is reference-only confirmation that the form submitted. It lives outside{' '}
          <code>NewsletterBand</code> and is not part of the production component.
        </p>
        <a className="newsletter-reference__back" href={index}>
          Back to reference index
        </a>
      </Container>
    </main>
  );
}
