import React from 'react';
import { Link } from 'react-router-dom';

export function CartPage(): React.ReactElement {
  return (
    <main id="main-content">
      <h1 tabIndex={-1} data-route-focus>
        Cart
      </h1>
      <p>Your shopping cart is empty.</p>
      <p>This is a technical placeholder for shopping cart.</p>
      <nav>
        <Link to="/">Back to Home</Link>
      </nav>
    </main>
  );
}
