import type { ReactNode } from 'react';
import { Accordion } from 'radix-ui';

import { Icon } from '../ui';

export interface FAQItem {
  readonly id: string;
  readonly question: string;
  readonly answer: ReactNode;
}

interface FAQAccordionProps {
  readonly items: readonly FAQItem[];
  readonly value?: string;
  readonly onValueChange: (value: string | undefined) => void;
}

export function FAQAccordion({ items, value, onValueChange }: FAQAccordionProps) {
  return (
    <Accordion.Root
      className="faq-accordion"
      collapsible
      onValueChange={(next) => {
        onValueChange(next === '' ? undefined : next);
      }}
      type="single"
      value={value ?? ''}
    >
      {items.map((item) => (
        <Accordion.Item className="faq-accordion__item" key={item.id} value={item.id}>
          <Accordion.Header className="faq-accordion__header">
            <Accordion.Trigger className="faq-accordion__question">
              <span className="faq-accordion__label">{item.question}</span>
              <Icon className="faq-accordion__icon" name="chevron-down" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="faq-accordion__content">
            <div className="faq-accordion__answer">{item.answer}</div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
