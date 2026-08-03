import React from 'react';

export function BootstrapPage(): React.ReactElement {
  return (
    <div>
      <h1>GoodCall Bootstrap</h1>
      <p>React SPA with TypeScript, Vite, and testing infrastructure.</p>
      <nav>
        <p>Example navigation:</p>
        <ul>
          <li>
            <a href="./">Home</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
