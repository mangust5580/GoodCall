import type { CartLine } from './cartFixtures';

export interface CartTotals {
  readonly unitCount: number;
  readonly selectedUnitCount: number;
  readonly selectedListTotal: number;
  readonly selectedDiscount: number;
  readonly selectedTotal: number;
}

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

const countFormatter = new Intl.NumberFormat('ru-RU');

const unitPluralRules = new Intl.PluralRules('ru-RU');

const UNIT_WORDS: Readonly<Record<Intl.LDMLPluralRule, string>> = {
  zero: 'товаров',
  one: 'товар',
  two: 'товара',
  few: 'товара',
  many: 'товаров',
  other: 'товара',
};

export function lineTotal(line: CartLine): number {
  return line.price * line.quantity;
}

export function lineListTotal(line: CartLine): number | undefined {
  return line.oldPrice !== undefined && line.oldPrice > line.price
    ? line.oldPrice * line.quantity
    : undefined;
}

export function lineDiscount(line: CartLine): number {
  const listTotal = lineListTotal(line);

  return listTotal === undefined ? 0 : listTotal - lineTotal(line);
}

export function lineDiscountPercent(line: CartLine): number | undefined {
  return line.oldPrice !== undefined && line.oldPrice > line.price
    ? Math.round(((line.oldPrice - line.price) / line.oldPrice) * 100)
    : undefined;
}

export function cartUnitCount(lines: readonly CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function cartTotals(lines: readonly CartLine[]): CartTotals {
  const selected = lines.filter((line) => line.selected);
  const selectedTotal = selected.reduce((sum, line) => sum + lineTotal(line), 0);
  const selectedDiscount = selected.reduce((sum, line) => sum + lineDiscount(line), 0);

  return {
    unitCount: cartUnitCount(lines),
    selectedUnitCount: cartUnitCount(selected),
    selectedListTotal: selectedTotal + selectedDiscount,
    selectedDiscount,
    selectedTotal,
  };
}

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function formatUnitCount(value: number): string {
  return `${countFormatter.format(value)} ${UNIT_WORDS[unitPluralRules.select(value)]}`;
}
