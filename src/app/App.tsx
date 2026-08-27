import { CatalogReference } from './CatalogReference';
import { ComponentsReference } from './ComponentsReference';
import { FooterReference } from './FooterReference';
import { FoundationsColorReference } from './FoundationsColorReference';
import { HeaderReference } from './HeaderReference';
import { LayoutReference } from './LayoutReference';
import { LocationReference } from './LocationReference';
import { NewsletterReference } from './NewsletterReference';
import { ReferenceIndex } from './TemporaryReference';

function currentReference(): string | null {
  return new URLSearchParams(window.location.search).get('reference');
}

export function App() {
  const reference = currentReference();

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

  return <ReferenceIndex />;
}
