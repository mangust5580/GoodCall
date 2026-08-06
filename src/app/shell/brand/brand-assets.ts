import horizontalPrimaryUrl from '@/assets/brand/goodcall-logo.svg';
import horizontalInverseUrl from '@/assets/brand/goodcall-logo-inverse.svg';
import horizontalMonochromeUrl from '@/assets/brand/goodcall-logo-monochrome.svg';
import symbolPrimaryUrl from '@/assets/brand/goodcall-symbol.svg';
import symbolInverseUrl from '@/assets/brand/goodcall-symbol-inverse.svg';
import symbolMonochromeUrl from '@/assets/brand/goodcall-symbol-monochrome.svg';

export type BrandLockup = 'horizontal' | 'symbol';
export type BrandVariant = 'primary' | 'inverse' | 'monochrome';
export type BrandRendering = 'image' | 'mask';

export interface BrandAsset {
  url: string;
  rendering: BrandRendering;
}

export const brandAssets: Record<BrandLockup, Record<BrandVariant, BrandAsset>> = {
  horizontal: {
    primary: { url: horizontalPrimaryUrl, rendering: 'image' },
    inverse: { url: horizontalInverseUrl, rendering: 'image' },
    monochrome: { url: horizontalMonochromeUrl, rendering: 'mask' },
  },
  symbol: {
    primary: { url: symbolPrimaryUrl, rendering: 'image' },
    inverse: { url: symbolInverseUrl, rendering: 'image' },
    monochrome: { url: symbolMonochromeUrl, rendering: 'mask' },
  },
};

export function selectBrandAsset(lockup: BrandLockup, variant: BrandVariant): BrandAsset {
  return brandAssets[lockup][variant];
}
