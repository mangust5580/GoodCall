import { Container } from '../components/layout';
import { MobileActionBar, NewsletterBand, SiteFooter } from '../components/shell';

import './FooterReference.scss';

export function FooterReference() {
  const base = import.meta.env.BASE_URL;

  return (
    <div className="footer-reference">
      <main className="footer-reference__body">
        <Container className="footer-reference__inner">
          <h1 className="footer-reference__title">Global Shell / SiteFooter</h1>
          <p className="footer-reference__note">
            Temporary development reference for the canonical GoodCall shell footer. Everything
            below this block is the real production shell seam: the accepted{' '}
            <code>NewsletterBand</code> followed by <code>SiteFooter</code>. The footer does not
            contain the newsletter band; the two stay independently reusable.
          </p>
          <p className="footer-reference__note">
            No router exists yet, so footer navigation labels and legal labels render as
            non-interactive text rather than fake links. Only genuinely actionable destinations are
            anchors: the brand home link, the support phone and the support email. The VK, Telegram,
            YouTube and RUTUBE marks are production visual content, but they stay non-interactive
            until real GoodCall destinations exist, so they add no tab stops.
          </p>
          <p className="footer-reference__note">
            Below 768px the real production <code>MobileActionBar</code> is fixed to the bottom of
            the viewport, so this page reserves its own bottom inset — the same reference-owned
            clearance the header reference uses. Production CSS adds no global body padding.
          </p>
          <a className="footer-reference__back" href={base}>
            Back to reference index
          </a>
        </Container>
      </main>

      <NewsletterBand />
      <SiteFooter homeHref={base} />
      <MobileActionBar cartCount={2} comparisonCount={3} favoritesCount={12} />
    </div>
  );
}
