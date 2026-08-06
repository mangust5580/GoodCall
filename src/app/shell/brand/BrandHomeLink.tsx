import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BrandHomeLink.module.scss';
import { selectBrandAsset, type BrandLockup, type BrandVariant } from './brand-assets';

export const BRAND_HOME_LINK_LABEL = 'GoodCall — на главную';

export interface BrandHomeLinkProps {
  lockup?: BrandLockup;
  variant?: BrandVariant;
  className?: string;
}

interface BrandMaskStyle extends React.CSSProperties {
  '--gc-brand-mask-image': string;
}

export function BrandHomeLink({
  lockup = 'horizontal',
  variant = 'primary',
  className,
}: BrandHomeLinkProps): React.ReactElement {
  const asset = selectBrandAsset(lockup, variant);

  const linkClassName = [styles['brand-home-link'], styles[lockup], className]
    .filter((value): value is string => typeof value === 'string' && value.length > 0)
    .join(' ');

  const maskStyle: BrandMaskStyle = { '--gc-brand-mask-image': `url("${asset.url}")` };

  return (
    <Link to="/" aria-label={BRAND_HOME_LINK_LABEL} className={linkClassName}>
      {asset.rendering === 'mask' ? (
        <span
          className={styles['brand-mask']}
          style={maskStyle}
          data-brand-asset={asset.url}
          aria-hidden="true"
        />
      ) : (
        <img
          className={styles['brand-image']}
          src={asset.url}
          alt=""
          data-brand-asset={asset.url}
        />
      )}
    </Link>
  );
}
