import { bootstrap } from '@/app/bootstrap';
import { renderBootstrapFailure } from '@/app/render-bootstrap-failure';

bootstrap().catch((error: unknown) => {
  renderBootstrapFailure(error);
});
