import brandMark from '../../assets/brand/brand-mark.svg';

export interface BrandLogoProps {
  readonly className?: string;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <span className={className ? `brand-logo ${className}` : 'brand-logo'}>
      <img alt="" className="brand-logo__mark" src={brandMark} />
      <span className="brand-logo__name">GOODCALL</span>
    </span>
  );
}
