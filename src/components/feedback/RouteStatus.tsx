import type { ReactNode } from 'react';

import { Container } from '../layout';

type RouteStatusProps =
  | { readonly kind: 'loading'; readonly message: string }
  | {
      readonly kind: 'failure';
      readonly title: string;
      readonly message: string;
      readonly actions: ReactNode;
    };

export function RouteStatus(props: RouteStatusProps) {
  if (props.kind === 'loading') {
    return (
      <main aria-busy="true" className="route-status">
        <Container className="route-status__inner">
          <p className="route-status__message" role="status">
            {props.message}
          </p>
        </Container>
      </main>
    );
  }

  return (
    <main className="route-status">
      <Container className="route-status__inner">
        <h1 className="route-status__title">{props.title}</h1>
        <p className="route-status__message">{props.message}</p>
        <div className="route-status__actions">{props.actions}</div>
      </Container>
    </main>
  );
}
