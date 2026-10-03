import { CatalogReference } from '../reference/CatalogReference';
import { ComponentsReference } from '../reference/ComponentsReference';
import { FooterReference } from '../reference/FooterReference';
import { FoundationsColorReference } from '../reference/FoundationsColorReference';
import { HeaderReference } from '../reference/HeaderReference';
import { HomeReference } from '../reference/HomeReference';
import { LayoutReference } from '../reference/LayoutReference';
import { LocationReference } from '../reference/LocationReference';
import { NewsletterReference } from '../reference/NewsletterReference';
import { ProductDetailsReference } from '../reference/ProductDetailsReference';
import { ReferenceIndex } from '../reference/TemporaryReference';
import { ProductionRouter } from './ProductionRouter';

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

  if (reference === 'product-details') {
    return <ProductDetailsReference />;
  }

  return <ReferenceIndex />;
}
