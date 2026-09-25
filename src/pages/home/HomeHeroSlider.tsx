import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import type { FocusEvent, PointerEvent } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { UseEmblaCarouselType } from 'embla-carousel-react';

import { HOME_MARKETING_MEDIA } from '../../assets/media/home/homeMarketingMedia';
import type { HomeMarketingAsset } from '../../assets/media/home/homeMarketingMedia';
import { HomeMarketingPicture } from './HomeMarketingPicture';
import type { HomeHeroMedia, HomeHeroSlide } from './homeFixtures';

const HERO_MEDIA_SIZES = '(max-width: 560px) 100vw, (max-width: 900px) calc(100vw - 32px), 1076px';

const AUTOPLAY_DELAY_MS = 6000;

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const HERO_CAROUSEL_OPTIONS = {
  align: 'start',
  loop: false,
  skipSnaps: false,
} as const;

type HeroCarouselApi = NonNullable<UseEmblaCarouselType[1]>;

const HERO_MEDIA: Readonly<Record<HomeHeroMedia, HomeMarketingAsset>> = {
  heroMainPromo: HOME_MARKETING_MEDIA.heroMainPromo,
};

function subscribeToReducedMotion(onChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);

  query.addEventListener('change', onChange);

  return () => {
    query.removeEventListener('change', onChange);
  };
}

function readReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function subscribeToDocumentVisibility(onChange: () => void): () => void {
  document.addEventListener('visibilitychange', onChange);

  return () => {
    document.removeEventListener('visibilitychange', onChange);
  };
}

function readDocumentHidden(): boolean {
  return document.hidden;
}

export interface HomeHeroSliderProps {
  readonly slides: readonly HomeHeroSlide[];
}

export function HomeHeroSlider({ slides }: HomeHeroSliderProps) {
  const [viewportRef, emblaApi] = useEmblaCarousel(HERO_CAROUSEL_OPTIONS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocusWithin, setKeyboardFocusWithin] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    readReducedMotion,
    () => false,
  );
  const documentHidden = useSyncExternalStore(
    subscribeToDocumentVisibility,
    readDocumentHidden,
    () => false,
  );
  const autoplayPaused =
    reducedMotion || documentHidden || hovered || keyboardFocusWithin || dragging;

  useEffect(() => {
    if (emblaApi === undefined) {
      return;
    }

    const syncSelected = (api: HeroCarouselApi) => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    const startDrag = () => {
      setDragging(true);
    };

    const endDrag = () => {
      setDragging(false);
    };

    syncSelected(emblaApi);
    emblaApi
      .on('select', syncSelected)
      .on('reInit', syncSelected)
      .on('pointerDown', startDrag)
      .on('pointerUp', endDrag);

    return () => {
      emblaApi
        .off('select', syncSelected)
        .off('reInit', syncSelected)
        .off('pointerDown', startDrag)
        .off('pointerUp', endDrag);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi === undefined || autoplayPaused) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const nextIndex = emblaApi.selectedScrollSnap() + 1;

      emblaApi.scrollTo(nextIndex < emblaApi.scrollSnapList().length ? nextIndex : 0);
    }, AUTOPLAY_DELAY_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [emblaApi, autoplayPaused, selectedIndex]);

  const goToSlide = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index, reducedMotion);
    },
    [emblaApi, reducedMotion],
  );

  const handlePointerEnter = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') {
      setHovered(true);
    }
  };

  const handlePointerLeave = () => {
    setHovered(false);
  };

  const handleFocus = (event: FocusEvent<HTMLElement>) => {
    if (event.target.matches(':focus-visible')) {
      setKeyboardFocusWithin(true);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    const nextFocus = event.relatedTarget;

    if (nextFocus instanceof Node && event.currentTarget.contains(nextFocus)) {
      return;
    }

    setKeyboardFocusWithin(false);
  };

  return (
    <section
      aria-label="Акции GoodCall"
      className="home-banner"
      onBlur={handleBlur}
      onFocus={handleFocus}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
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
