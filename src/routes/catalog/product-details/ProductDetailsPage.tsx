import React from 'react';
import { useParams, Link } from 'react-router-dom';

export function ProductDetailsPage(): React.ReactElement {
  const { productSlug } = useParams<{ productSlug: string }>();

  return (
    <main id="main-content">
      <h1 tabIndex={-1} data-route-focus>
        Product
      </h1>
      <p>Product: {productSlug}</p>
      <p>This is a technical placeholder for product details.</p>
      <nav>
        <Link to="/">Back to Home</Link>
      </nav>
    </main>
  );
}
