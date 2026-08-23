import { Icon } from '../ui';

interface ProductAvailabilityProps {
  readonly status: string;
}

export function ProductAvailability({ status }: ProductAvailabilityProps) {
  return (
    <p className="product-availability">
      <Icon className="product-availability__icon" name="check" />
      {status}
    </p>
  );
}
