import { CatalogReference } from './CatalogReference';
import { ComponentsReference } from './ComponentsReference';
import { FooterReference } from './FooterReference';
import { FoundationsColorReference } from './FoundationsColorReference';
import { HeaderReference } from './HeaderReference';
import { HomeReference } from './HomeReference';
import { LayoutReference } from './LayoutReference';
import { LocationReference } from './LocationReference';
import { NewsletterReference } from './NewsletterReference';
import { ProductionRouter } from './ProductionRouter';
import { ReferenceIndex } from './TemporaryReference';

function currentReference(): string | null {
  return new URLSearchParams(window.location.search).get('reference');
}

export function App() {
  const reference = currentReference();

  if (reference === null) {
    return <ProductionRouter />;
  }

  if (reference === 'foundations') {
    return <FoundationsColorReference />;
  }

  if (reference === 'components') {
    return <ComponentsReference />;
  }

  if (reference === 'layout') {
    return <LayoutReference />;
  }

  if (reference === 'header') {
    return <HeaderReference />;
  }

  if (reference === 'location') {
    return <LocationReference />;
  }

  if (reference === 'newsletter') {
    return <NewsletterReference />;
  }

  if (reference === 'footer') {
    return <FooterReference />;
  }

  if (reference === 'catalog') {
    return <CatalogReference />;
  }

  if (reference === 'home') {
    return <HomeReference />;
  }

  return <ReferenceIndex />;
}
