import React from 'react';
import { Link } from 'react-router-dom';

export function HomePage(): React.ReactElement {
  return (
    <main id="main-content">
      <h1 tabIndex={-1} data-route-focus>
        GoodCall
      </h1>
      <p>React SPA with TypeScript, Vite, and testing infrastructure.</p>
      <nav>
        <p>Navigate to:</p>
        <ul>
          <li>
            <Link to="/catalog/laptops">Catalog Category</Link>
          </li>
          <li>
            <Link to="/products/demo-product">Product Details</Link>
          </li>
          <li>
            <Link to="/cart">Shopping Cart</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
