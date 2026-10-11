import { CatalogReference } from './CatalogReference';
import { ComponentsReference } from './ComponentsReference';
import { FooterReference } from './FooterReference';
import { FoundationsColorReference } from './FoundationsColorReference';
import { HeaderReference } from './HeaderReference';
import { HomeReference } from './HomeReference';
import { LayoutReference } from './LayoutReference';
import { LocationReference } from './LocationReference';
import { NewsletterReference } from './NewsletterReference';
import { ProductDetailsReference } from './ProductDetailsReference';
import { ReferenceIndex } from './TemporaryReference';

interface ReferenceSurfaceProps {
  readonly reference: string;
}

export default function ReferenceSurface({ reference }: ReferenceSurfaceProps) {
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
