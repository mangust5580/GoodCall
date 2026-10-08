import { HomePage } from '../pages/home';
import type { BenefitItem } from '../components/content';
import { MobileActionBar, NewsletterBand, SiteFooter, SiteHeader } from '../components/shell';
import { referenceUrl } from './referenceUrl';

import './HomeReference.scss';

const HOME_SPECIMEN_BENEFITS: readonly BenefitItem[] = [
  { title: 'Гарантия до 24 месяцев', note: 'на все товары', icon: 'check' },
  { title: 'Оригинальная продукция', note: 'только официальные поставки', icon: 'package' },
  { title: 'Быстрая доставка', note: 'от 1 дня по всей России', icon: 'store' },
  { title: 'Поддержка 24/7', note: 'мы всегда на связи', icon: 'headset' },
];

export function HomeReference() {
  const index = referenceUrl('index');

  return (
    <div className="home-reference">
      <p className="home-reference__note" lang="en">
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
      <HomePage benefits={HOME_SPECIMEN_BENEFITS} />
      <NewsletterBand />
      <SiteFooter homeHref={index} />
      <MobileActionBar cartCount={2} comparisonCount={3} favoritesCount={12} />
    </div>
  );
}
