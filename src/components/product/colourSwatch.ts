const COLOUR_SWATCH_BY_LABEL: Readonly<Partial<Record<string, string>>> = {
  Чёрный: 'black',
  Серый: 'gray',
  Белый: 'white',
  Фиолетовый: 'violet',
  Синий: 'blue',
  Зелёный: 'green',
  Розовый: 'pink',
  Красный: 'red',
  Золотой: 'gold',
  Жёлтый: 'yellow',
  Бирюзовый: 'teal',
};

export function colourSwatch(label: string): string | undefined {
  return Object.hasOwn(COLOUR_SWATCH_BY_LABEL, label) ? COLOUR_SWATCH_BY_LABEL[label] : undefined;
}
