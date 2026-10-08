const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function formatMemorySize(gigabytes: number): string {
  return gigabytes >= 1024 && gigabytes % 1024 === 0
    ? `${String(gigabytes / 1024)} ТБ`
    : `${String(gigabytes)} ГБ`;
}
