import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { APP_BASE_PATH } from '@/app/config';
import { Shell } from '@/app/shell/Shell';
import { BootstrapPage } from '@/app/shell/pages/BootstrapPage';

const basename = import.meta.env.PROD ? APP_BASE_PATH : '/';

export function Router(): React.ReactElement {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<BootstrapPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
