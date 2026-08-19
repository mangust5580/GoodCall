import { useState } from 'react';
import type { ReactNode } from 'react';

import './FoundationsColorReference.scss';

/**
 * Foundations / Colors reference surface.
 *
 * A development-only surface for comparing the implemented colour system against
 * GoodCall-references/Foundations.png. It is not product UI and the specimens
 * below are not a component library — nothing here should be extracted into
 * reusable components. That is Components milestone work.
 *
 * Swatch values are read back from the live CSS custom properties rather than
 * duplicated in TypeScript, so the SCSS token maps stay the single source of
 * truth and this surface shows what the browser actually resolved.
 */

interface Token {
  readonly name: string;
  readonly label: string;
}

interface Group {
  readonly title: string;
  readonly tokens: readonly Token[];
}

const ramp = (prefix: string, steps: readonly string[]): Token[] =>
  steps.map((step) => ({ name: `--${prefix}-${step}`, label: step }));

const PRIMITIVES: readonly Group[] = [
  {
    title: 'Base',
    tokens: [
      { name: '--color-base-white', label: 'White' },
      { name: '--color-base-rich-text', label: 'Black / Rich Text' },
    ],
  },
  {
    title: 'Status',
    tokens: [
      { name: '--color-status-success', label: 'Success' },
      { name: '--color-status-warning', label: 'Warning' },
      { name: '--color-status-danger', label: 'Danger' },
      { name: '--color-status-info', label: 'Info' },
    ],
  },
  {
    title: 'Brand Purple',
    tokens: ramp('color-brand-purple', [
      '50',
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900',
    ]),
  },
  {
    title: 'Accent Violet',
    tokens: ramp('color-accent-violet', ['100', '200', '300', '400', '500', '600', '700']),
  },
  {
    title: 'Neutral Gray',
    tokens: ramp('color-neutral-gray', [
      '50',
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900',
    ]),
  },
];

const ALPHAS: readonly Group[] = [
  {
    title: 'White alpha (base #FFFFFF)',
    tokens: ramp('alpha-white', ['08', '12', '16', '24', '36']),
  },
  {
    title: 'Black alpha (base #12131A)',
    tokens: ramp('alpha-black', ['04', '08', '12', '24', '36']),
  },
  {
    title: 'Purple alpha (base #8A3FFC)',
    tokens: ramp('alpha-purple', ['08', '12', '16', '24', '36']),
  },
];

const ROLES: readonly Group[] = [
  {
    title: 'Text',
    tokens: [
      { name: '--role-text-primary', label: 'Primary' },
      { name: '--role-text-secondary', label: 'Secondary' },
      { name: '--role-text-muted', label: 'Muted' },
      { name: '--role-text-subtle', label: 'Subtle' },
      { name: '--role-text-inverse', label: 'Inverse' },
      { name: '--role-text-link', label: 'Link' },
      { name: '--role-text-link-hover', label: 'Link Hover' },
    ],
  },
  {
    title: 'Surface',
    tokens: [
      { name: '--role-surface-page', label: 'Page' },
      { name: '--role-surface-page-soft', label: 'Page Soft' },
      { name: '--role-surface-card', label: 'Card' },
      { name: '--role-surface-card-soft', label: 'Card Soft' },
      { name: '--role-surface-header', label: 'Header' },
      { name: '--role-surface-modal', label: 'Modal' },
      { name: '--role-surface-brand-soft', label: 'Brand Soft' },
      { name: '--role-surface-hero', label: 'Hero' },
      { name: '--role-surface-footer', label: 'Footer' },
    ],
  },
  {
    title: 'Border',
    tokens: [
      { name: '--role-border-soft', label: 'Soft' },
      { name: '--role-border-default', label: 'Default' },
      { name: '--role-border-strong', label: 'Strong' },
      { name: '--role-border-brand', label: 'Brand' },
      { name: '--role-border-focus', label: 'Focus' },
    ],
  },
  {
    title: 'State / Utility',
    tokens: [
      { name: '--role-state-success', label: 'Success' },
      { name: '--role-state-success-soft', label: 'Success Soft' },
      { name: '--role-state-warning', label: 'Warning' },
      { name: '--role-state-warning-soft', label: 'Warning Soft' },
      { name: '--role-state-danger', label: 'Danger' },
      { name: '--role-state-danger-soft', label: 'Danger Soft' },
      { name: '--role-state-info', label: 'Info' },
      { name: '--role-state-info-soft', label: 'Info Soft' },
      { name: '--role-state-disabled', label: 'Disabled' },
    ],
  },
];

const COMPOSED: readonly Token[] = [
  { name: '--role-overlay-base', label: 'Overlay' },
  { name: '--role-backdrop-base', label: 'Backdrop' },
];

const GRADIENTS: readonly Token[] = [
  { name: '--gradient-brand-vertical', label: 'Brand Vertical' },
  { name: '--gradient-brand-horizontal', label: 'Brand Horizontal' },
  { name: '--gradient-hero-glow', label: 'Hero Glow' },
  { name: '--gradient-cta', label: 'CTA Gradient' },
  { name: '--gradient-footer', label: 'Footer Gradient' },
  { name: '--gradient-soft-card-glow', label: 'Soft Card Glow' },
];

const ALL_TOKEN_NAMES: readonly string[] = [
  ...[...PRIMITIVES, ...ALPHAS, ...ROLES].flatMap((group) => group.tokens.map((t) => t.name)),
  ...COMPOSED.map((t) => t.name),
];

/**
 * Normalise a resolved custom property for display so it reads the way the
 * raster annotates it: #abc and #aabbcc become #AABBCC, and the 8-digit hex a
 * browser resolves an alpha colour to becomes rgba(...). Gradients pass through.
 */
function formatValue(value: string): string {
  const trimmed = value.trim();
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(trimmed);

  if (short) {
    return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`.toUpperCase();
  }

  const withAlpha = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(trimmed);

  if (withAlpha) {
    const [r, g, b] = [withAlpha[1], withAlpha[2], withAlpha[3]].map((c) => parseInt(c, 16));
    const alpha = Math.round((parseInt(withAlpha[4], 16) / 255) * 100) / 100;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return /^#[0-9a-f]{6}$/i.test(trimmed) ? trimmed.toUpperCase() : trimmed;
}

function readResolvedTokens(): Record<string, string> {
  const computed = getComputedStyle(document.documentElement);
  const resolved: Record<string, string> = {};

  for (const name of ALL_TOKEN_NAMES) {
    resolved[name] = formatValue(computed.getPropertyValue(name));
  }

  return resolved;
}

/**
 * Read the tokens once, lazily, on first render. The stylesheet is applied
 * before this module runs in both dev and production, so the values are already
 * resolved; a lazy initialiser avoids the cascading render that setting state
 * from an effect would cause.
 */
function useResolvedTokens(): Record<string, string> {
  const [values] = useState(readResolvedTokens);

  return values;
}

interface SwatchListProps {
  readonly group: Group;
  readonly values: Record<string, string>;
  readonly variant?: 'solid' | 'alpha';
}

function SwatchList({ group, values, variant = 'solid' }: SwatchListProps) {
  return (
    <div className="group">
      <h3 className="group__title">{group.title}</h3>
      <ul className="group__items">
        {group.tokens.map((token) => (
          <li className="swatch" key={token.name}>
            <span
              className={variant === 'alpha' ? 'swatch__chip swatch__chip--alpha' : 'swatch__chip'}
            >
              <span className="swatch__fill" style={{ background: `var(${token.name})` }} />
            </span>
            <span className="swatch__label">{token.label}</span>
            <code className="swatch__value">{values[token.name] ?? '—'}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface SectionProps {
  readonly index: number;
  readonly title: string;
  readonly children: ReactNode;
}

function Section({ index, title, children }: SectionProps) {
  return (
    <section className="section">
      <header className="section__head">
        <span className="section__index">{index}</span>
        <h2 className="section__title">{title}</h2>
      </header>
      {children}
    </section>
  );
}

export function FoundationsColorReference() {
  const values = useResolvedTokens();

  return (
    <div className="reference">
      <header className="reference__head">
        <span className="reference__brand">GOODCALL</span>
        <span className="reference__caption">Foundations / Colors</span>
      </header>

      <Section index={1} title="Primitive colors">
        {PRIMITIVES.map((group) => (
          <SwatchList group={group} key={group.title} values={values} />
        ))}
      </Section>

      <Section index={2} title="Alpha colors">
        {ALPHAS.map((group) => (
          <SwatchList group={group} key={group.title} values={values} variant="alpha" />
        ))}
      </Section>

      <Section index={3} title="Semantic / Role colors">
        {ROLES.map((group) => (
          <SwatchList group={group} key={group.title} values={values} />
        ))}

        <div className="group">
          <h3 className="group__title">Overlay / Backdrop</h3>
          <ul className="group__items">
            {COMPOSED.map((token) => (
              <li className="swatch" key={token.name}>
                <span className="swatch__chip swatch__chip--alpha">
                  <span className="swatch__fill" style={{ background: `var(${token.name})` }} />
                </span>
                <span className="swatch__label">{token.label}</span>
                <code className="swatch__value">{values[token.name] ?? '—'}</code>
                <span className="swatch__note">opacity TBD</span>
              </li>
            ))}
          </ul>
          <p className="group__note">
            The raster gives both roles the same colour over a checkerboard but states no opacity
            and no difference between them. Only the base colour is defined; composition is deferred
            until there is a real consumer or explicit design evidence.
          </p>
        </div>
      </Section>

      <Section index={4} title="Gradients">
        <ul className="gradients">
          {GRADIENTS.map((token) => (
            <li className="gradients__item" key={token.name}>
              <span className="gradients__swatch" style={{ background: `var(${token.name})` }} />
              <span className="gradients__label">{token.label}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section index={5} title="Usage examples">
        <ul className="usage">
          <li className="usage__card">
            <span className="usage__title">Основная кнопка</span>
            <span className="usage__body">
              <button className="spec-button spec-button--primary" type="button">
                Позвонить
              </button>
            </span>
            <span className="usage__caption">Primary / Заполненная</span>
          </li>

          <li className="usage__card">
            <span className="usage__title">Вторичная кнопка</span>
            <span className="usage__body">
              <button className="spec-button spec-button--secondary" type="button">
                Подробнее
              </button>
            </span>
            <span className="usage__caption">Secondary / Обводка</span>
          </li>

          <li className="usage__card">
            <span className="usage__title">Метка / Badges</span>
            <span className="usage__body">
              <span className="spec-badge spec-badge--brand">Новинка</span>
              <span className="spec-badge spec-badge--success">В наличии</span>
            </span>
            <span className="usage__caption">На карточках товаров</span>
          </li>

          <li className="usage__card">
            <span className="usage__title">Инпут (фокус)</span>
            <span className="usage__body">
              <input
                aria-label="Номер телефона"
                className="spec-input"
                placeholder="Введите номер"
                readOnly
                type="text"
              />
            </span>
            <span className="usage__caption">Focus: #8A3FFC</span>
          </li>

          <li className="usage__card">
            <span className="usage__title">Цена</span>
            <span className="usage__body">
              <span className="spec-price">12 490 ₽</span>
              <s className="spec-price__old">14 990 ₽</s>
            </span>
            <span className="usage__caption">Primary + Muted</span>
          </li>

          <li className="usage__card">
            <span className="usage__title">Промо-чип</span>
            <span className="usage__body">
              <span className="spec-chip">Скидка 15%</span>
            </span>
            <span className="usage__caption">Brand Soft + Brand</span>
          </li>
        </ul>
      </Section>
    </div>
  );
}
