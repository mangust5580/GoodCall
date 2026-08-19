import { ComponentsReference } from './ComponentsReference';
import { FoundationsColorReference } from './FoundationsColorReference';
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

  return <ReferenceIndex />;
}
