import {
  AccountAddressesRoute,
  AccountOrdersRoute,
  AccountProfileRoute,
  AccountRoute,
  LoginRoute,
} from './AccountRoutes';
import { CheckoutRoute } from './CheckoutRoute';
import { OrderConfirmationRoute } from './OrderConfirmationRoute';

export type AccountFlowRouteName =
  | 'checkout'
  | 'order-confirmation'
  | 'login'
  | 'account'
  | 'account-orders'
  | 'account-profile'
  | 'account-addresses';

interface AccountFlowRouteProps {
  readonly name: AccountFlowRouteName;
}

export default function AccountFlowRoute({ name }: AccountFlowRouteProps) {
  switch (name) {
    case 'checkout':
      return <CheckoutRoute />;
    case 'order-confirmation':
      return <OrderConfirmationRoute />;
    case 'login':
      return <LoginRoute />;
    case 'account':
      return <AccountRoute />;
    case 'account-orders':
      return <AccountOrdersRoute />;
    case 'account-profile':
      return <AccountProfileRoute />;
    case 'account-addresses':
      return <AccountAddressesRoute />;
  }
}
