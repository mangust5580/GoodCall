import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { UseEmblaCarouselType } from 'embla-carousel-react';

import { HOME_MARKETING_MEDIA } from '../../assets/media/home/homeMarketingMedia';
import type { HomeMarketingAsset } from '../../assets/media/home/homeMarketingMedia';
import { HomeMarketingPicture } from './HomeMarketingPicture';
import type { HomeHeroMedia, HomeHeroSlide } from './homeFixtures';

const HERO_MEDIA_SIZES = '(max-width: 560px) 100vw, (max-width: 900px) calc(100vw - 32px), 1076px';

const HERO_CAROUSEL_OPTIONS = {
  align: 'start',
  loop: false,
  skipSnaps: false,
} as const;

type HeroCarouselApi = NonNullable<UseEmblaCarouselType[1]>;

const HERO_MEDIA: Readonly<Record<HomeHeroMedia, HomeMarketingAsset>> = {
  heroMainPromo: HOME_MARKETING_MEDIA.heroMainPromo,
};

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface HomeHeroSliderProps {
  readonly slides: readonly HomeHeroSlide[];
}

export function HomeHeroSlider({ slides }: HomeHeroSliderProps) {
  const [viewportRef, emblaApi] = useEmblaCarousel(HERO_CAROUSEL_OPTIONS);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (emblaApi === undefined) {
      return;
    }

    const syncSelected = (api: HeroCarouselApi) => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    syncSelected(emblaApi);
    emblaApi.on('select', syncSelected).on('reInit', syncSelected);

    return () => {
      emblaApi.off('select', syncSelected).off('reInit', syncSelected);
    };
  }, [emblaApi]);

  const goToSlide = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index, prefersReducedMotion());
    },
    [emblaApi],
  );

  return (
    <section aria-label="Акции GoodCall" className="home-banner">
      <div className="home-banner__viewport" ref={viewportRef}>
        <div className="home-banner__track">
          {slides.map((slide, index) => {
            const active = index === selectedIndex;
            const Title = active ? 'h1' : 'p';

            return (
              <div
                aria-label={`Слайд ${index + 1} из ${slides.length}`}
                className="home-banner__slide"
                inert={!active}
                key={slide.id}
                role="group"
              >
                <HomeMarketingPicture
                  alt=""
                  asset={HERO_MEDIA[slide.media]}
                  className="home-banner__media"
                  fetchPriority={index === 0 ? 'high' : undefined}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  sizes={HERO_MEDIA_SIZES}
                />
                <div className="home-banner__content">
                  <Title className="home-banner__title">
                    {slide.title} <span className="home-banner__accent">{slide.accent}</span>
                  </Title>
                  <p className="home-banner__lead">{slide.lead}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="home-banner__dots">
        {slides.map((slide, index) => (
          <button
            aria-current={index === selectedIndex ? 'true' : undefined}
            aria-label={`Перейти к слайду ${index + 1}`}
            className="home-banner__dot"
            key={slide.id}
            onClick={() => {
              goToSlide(index);
            }}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}
