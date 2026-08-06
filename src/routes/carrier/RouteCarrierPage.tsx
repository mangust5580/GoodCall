import React from 'react';
import { Link, PageContainer, Stack } from '@/shared/ui';
import { CARRIER_HOME_LINK_LABEL, CARRIER_NOTICE } from '@/app/routing/carriers';

export interface RouteCarrierPageProps {
  heading: string;
}

export function RouteCarrierPage({ heading }: RouteCarrierPageProps): React.ReactElement {
  return (
    <PageContainer as="main" id="main-content" tabIndex={-1}>
      <Stack gap="md">
        <h1 tabIndex={-1} data-route-focus>
          {heading}
        </h1>
        <p>{CARRIER_NOTICE}</p>
        <Link to="/">{CARRIER_HOME_LINK_LABEL}</Link>
      </Stack>
    </PageContainer>
  );
}
