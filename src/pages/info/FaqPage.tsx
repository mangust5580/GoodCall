import { useState } from 'react';

import { STOREFRONT_SUPPORT, STOREFRONT_TRUST } from '../../commerce/storefront';
import type { BenefitItem } from '../../components/content';
import { FAQAccordion } from '../../components/feedback';
import type { FAQItem } from '../../components/feedback';
import { Container } from '../../components/layout';
import { Button, Icon, SearchField } from '../../components/ui';
import type { IconName } from '../../components/ui';
import { InfoPageHeader } from './InfoPageHeader';
import { InfoHighlights } from './InfoParts';
import { InfoSupport } from './InfoSupport';
import { FAQ_CATEGORIES, FAQ_DEFAULT_OPEN_ID, FAQ_ENTRIES } from './faqData';
import type { FaqCategoryId, FaqEntry } from './faqData';
import { faqQueryTerms, filterFaqEntries } from './faqSearch';
import type { InfoLinks } from './infoLinks';

const HIGHLIGHTS: readonly BenefitItem[] = [
  ...STOREFRONT_TRUST.map((item) => ({ title: item.title, note: item.text, icon: item.icon })),
  { title: 'Поддержка', note: STOREFRONT_SUPPORT.hours, icon: 'headset' },
];

const countFormatter = new Intl.NumberFormat('ru-RU');
const pluralRules = new Intl.PluralRules('ru-RU');

const QUESTION_WORDS: Readonly<Record<Intl.LDMLPluralRule, string>> = {
  zero: 'вопросов',
  one: 'вопрос',
  two: 'вопроса',
  few: 'вопроса',
  many: 'вопросов',
  other: 'вопроса',
};

function formatQuestionCount(value: number): string {
  return `${countFormatter.format(value)} ${QUESTION_WORDS[pluralRules.select(value)]}`;
}

function faqAnswer(entry: FaqEntry, links: InfoLinks) {
  return (
    <div className="faq-answer">
      {entry.answer.map((paragraph) => (
        <p className="faq-answer__text" key={paragraph}>
          {paragraph}
        </p>
      ))}
      {entry.steps === undefined ? null : (
        <ol aria-label="Шаги оформления заказа" className="faq-steps">
          {entry.steps.map((step, index) => (
            <li className="faq-steps__item" key={step}>
              <span aria-hidden="true" className="faq-steps__number">
                {index + 1}
              </span>
              <span className="faq-steps__text">{step}</span>
            </li>
          ))}
        </ol>
      )}
      {entry.link === undefined ? null : (
        <a className="faq-answer__link" href={links[entry.link.to]}>
          {entry.link.label}
          <Icon name="chevron-right" />
        </a>
      )}
    </div>
  );
}

interface FaqPageProps {
  readonly links: InfoLinks;
}

export function FaqPage({ links }: FaqPageProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FaqCategoryId | undefined>();
  const [openId, setOpenId] = useState<string | undefined>(FAQ_DEFAULT_OPEN_ID);

  const terms = faqQueryTerms(query);
  const visible = filterFaqEntries(FAQ_ENTRIES, category, terms);
  const searchMatches = filterFaqEntries(FAQ_ENTRIES, undefined, terms);
  const activeLabel = FAQ_CATEGORIES.find((item) => item.id === category)?.label ?? 'Все вопросы';

  const items: readonly FAQItem[] = visible.map((entry) => ({
    id: entry.id,
    question: entry.question,
    answer: faqAnswer(entry, links),
  }));

  const applyFilter = (nextCategory: FaqCategoryId | undefined, nextQuery: string) => {
    setCategory(nextCategory);
    setQuery(nextQuery);
    setOpenId(filterFaqEntries(FAQ_ENTRIES, nextCategory, faqQueryTerms(nextQuery))[0]?.id);
  };

  const resetFilters = () => {
    applyFilter(undefined, '');
  };

  const categoryButton = (id: FaqCategoryId | undefined, label: string, icon: IconName) => {
    const count =
      id === undefined
        ? searchMatches.length
        : searchMatches.filter((entry) => entry.category === id).length;

    return (
      <button
        aria-pressed={category === id}
        className="faq-topics__item"
        key={id ?? 'all'}
        onClick={() => {
          applyFilter(id, query);
        }}
        type="button"
      >
        <Icon className="faq-topics__icon" name={icon} />
        <span className="faq-topics__label">{label}</span>
        <span aria-hidden="true" className="faq-topics__count">
          {countFormatter.format(count)}
        </span>
        <span className="ui-visually-hidden">{`, ${formatQuestionCount(count)}`}</span>
      </button>
    );
  };

  return (
    <main className="info-page faq-page">
      <Container>
        <InfoPageHeader
          aside={
            <div className="faq-page__search" role="search">
              <SearchField
                label="Поиск по вопросам"
                labelVisuallyHidden
                onClear={() => {
                  applyFilter(category, '');
                }}
                onValueChange={(value) => {
                  applyFilter(category, value);
                }}
                placeholder="Поиск по вопросам"
                value={query}
              />
            </div>
          }
          crumb="FAQ"
          homeHref={links.home}
          lead="Ответы на частые вопросы о заказах, оплате, доставке, гарантии и товарах GoodCall."
          title="Часто задаваемые вопросы"
        />

        <div className="faq-workspace">
          <nav aria-labelledby="faq-topics-title" className="faq-topics">
            <h2 className="ui-visually-hidden" id="faq-topics-title">
              Темы вопросов
            </h2>
            <div className="faq-topics__list" role="group" aria-labelledby="faq-topics-title">
              {categoryButton(undefined, 'Все вопросы', 'message')}
              {FAQ_CATEGORIES.map((item) => categoryButton(item.id, item.label, item.icon))}
            </div>
          </nav>

          <section aria-labelledby="faq-results-title" className="faq-results">
            <div className="faq-results__heading">
              <h2 className="faq-results__title" id="faq-results-title">
                {activeLabel}
              </h2>
              <p aria-live="polite" className="faq-results__count">
                {terms.length === 0
                  ? formatQuestionCount(visible.length)
                  : `Найдено: ${formatQuestionCount(visible.length)}`}
              </p>
            </div>

            {items.length === 0 ? (
              <div className="faq-empty">
                <Icon className="faq-empty__icon" name="search" />
                <h3 className="faq-empty__title">Ничего не найдено</h3>
                <p className="faq-empty__text">
                  Попробуйте изменить запрос или выбрать другую тему. Если ответа нет — напишите или
                  позвоните в поддержку.
                </p>
                <Button className="faq-empty__action" onClick={resetFilters} variant="secondary">
                  Сбросить поиск
                </Button>
              </div>
            ) : (
              <FAQAccordion items={items} onValueChange={setOpenId} value={openId} />
            )}
          </section>

          <div className="faq-workspace__support">
            <InfoSupport
              links={[
                { label: 'Доставка и оплата', href: links.delivery },
                { label: 'Гарантия и возврат', href: links.warranty },
              ]}
              text="Напишите или позвоните — поможем с заказом, доставкой и гарантией."
              title="Не нашли ответ?"
              titleId="faq-support-title"
            />
          </div>
        </div>

        <InfoHighlights items={HIGHLIGHTS} label="Почему GoodCall" />
      </Container>
    </main>
  );
}
