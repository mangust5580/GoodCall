import type { ReactNode } from 'react';

import { Icon } from '../ui';

export interface FAQItem {
  readonly id: string;
  readonly question: string;
  readonly answer: ReactNode;
}

interface FAQAccordionProps {
  readonly items: readonly FAQItem[];
  readonly openIds: readonly string[];
  readonly onOpenChange: (id: string, open: boolean) => void;
}

export function FAQAccordion({ items, openIds, onOpenChange }: FAQAccordionProps) {
  return (
    <div className="faq-accordion">
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);

        return (
          <details
            className="faq-accordion__item"
            key={item.id}
            onToggle={(event) => {
              const next = event.currentTarget.open;

              if (next !== isOpen) {
                onOpenChange(item.id, next);
              }
            }}
            open={isOpen}
          >
            <summary className="faq-accordion__question">
              <span className="faq-accordion__label">{item.question}</span>
              <Icon className="faq-accordion__icon" name="chevron-down" />
            </summary>
            <div className="faq-accordion__answer">{item.answer}</div>
          </details>
        );
      })}
    </div>
  );
}
