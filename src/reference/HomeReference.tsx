import { HomePage } from '../pages/home';
import { MobileActionBar, NewsletterBand, SiteFooter, SiteHeader } from '../components/shell';
import { referenceUrl } from './referenceUrl';

import './HomeReference.scss';

export function HomeReference() {
  const index = referenceUrl('index');

  return (
    <div className="home-reference">
      <p className="home-reference__note">
        Temporary development reference for the Home page family. Everything below is the real
        production shell around the real <code>HomePage</code>. Home A owns page structure and
        section inventory from <code>Home.png</code>; section depth, promotional artwork and the
        section-level destinations are still open. The production route for this page is{' '}
        <code>#/</code>.{' '}
        <a className="home-reference__back" href={index}>
          Back to reference index
        </a>
      </p>

      <SiteHeader cartCount={2} comparisonCount={3} favoritesCount={12} homeHref={index} />
      <HomePage />
      <NewsletterBand />
      <SiteFooter homeHref={index} />
      <MobileActionBar cartCount={2} comparisonCount={3} favoritesCount={12} />
    </div>
  );
}
