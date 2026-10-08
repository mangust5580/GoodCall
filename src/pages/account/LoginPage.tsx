import { useEffect, useState } from 'react';

import { BenefitsStrip } from '../../components/content';
import { Breadcrumbs, Container } from '../../components/layout';
import { Button, Icon } from '../../components/ui';
import { ACCOUNT_BENEFITS, ACCOUNT_DEMO_FEATURES, ACCOUNT_DEMO_PROMISES } from './accountFixtures';
import type { AccountDemoFeature } from './accountFixtures';

export interface LoginPageProps {
  readonly homeHref: string;
  readonly onEnterDemo: () => void;
  readonly status?: string;
  readonly focusTitle?: boolean;
}

const TITLE_ID = 'login-title';
const STATUS_DELAY_MS = 50;

function FeatureList({
  items,
  label,
}: {
  readonly items: readonly AccountDemoFeature[];
  readonly label: string;
}) {
  return (
    <ul aria-label={label} className="login-features">
      {items.map((item) => (
        <li className="login-features__item" key={item.title}>
          <span className="login-features__glyph">
            <Icon className="login-features__icon" name={item.icon} />
          </span>
          <span className="login-features__body">
            <span className="login-features__title">{item.title}</span>
            <span className="login-features__note">{item.note}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function LoginPage({
  homeHref,
  onEnterDemo,
  status = '',
  focusTitle = false,
}: LoginPageProps) {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (focusTitle) {
      document.getElementById(TITLE_ID)?.focus({ preventScroll: true });
    }
  }, [focusTitle]);

  useEffect(() => {
    if (status === '') {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setAnnouncement(status);
    }, STATUS_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [status]);

  return (
    <main className="login-page">
      <Container>
        <Breadcrumbs
          className="account-crumbs"
          items={[{ label: 'Главная', href: homeHref }, { label: 'Вход' }]}
        />

        <header className="login-page__heading">
          <h1 className="login-page__title" id={TITLE_ID} tabIndex={-1}>
            Добро <span className="login-page__accent">пожаловать</span>
          </h1>
          <p className="login-page__lead">
            Откройте демо-аккаунт, чтобы познакомиться с личным кабинетом GoodCall.
          </p>
        </header>

        <p
          aria-atomic="true"
          className={
            announcement === '' ? 'login-page__status ui-visually-hidden' : 'login-page__status'
          }
          role="status"
        >
          {announcement}
        </p>

        <div className="login-card">
          <section aria-labelledby="login-entry-title" className="login-card__panel">
            <h2 className="login-card__title" id="login-entry-title">
              Вход
            </h2>
            <p className="login-card__subtitle">
              Это демо-аккаунт для знакомства с магазином. Всё, что вы в нём увидите, хранится
              только в этом браузере.
            </p>
            <FeatureList items={ACCOUNT_DEMO_PROMISES} label="Как устроен демо-аккаунт" />
            <Button className="login-card__action" onClick={onEnterDemo}>
              Войти в демо-аккаунт
            </Button>
          </section>

          <section aria-labelledby="login-features-title" className="login-card__panel">
            <h2 className="login-card__title" id="login-features-title">
              Что есть в демо-аккаунте
            </h2>
            <p className="login-card__subtitle">Всё можно посмотреть сразу после входа.</p>
            <FeatureList items={ACCOUNT_DEMO_FEATURES} label="Разделы демо-аккаунта" />
          </section>
        </div>

        <BenefitsStrip items={ACCOUNT_BENEFITS} label="Преимущества GoodCall" />
      </Container>
    </main>
  );
}
