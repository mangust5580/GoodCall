import React from 'react';
import { useParams, Link } from 'react-router-dom';

export function CategoryListingPage(): React.ReactElement {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  return (
    <main id="main-content" tabIndex={-1}>
      <h1 tabIndex={-1} data-route-focus>
        Category
      </h1>
      <p>Category: {categorySlug}</p>
      <p>This is a technical placeholder for category listing.</p>
      <nav>
        <Link to="/">Back to Home</Link>
      </nav>
    </main>
  );
}
