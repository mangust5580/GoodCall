import { PRODUCT_DETAILS_APPLE_WATCH_S9_MEDIA } from '../../../assets/media/product-details/productDetailsMedia';
import type { ProductDetailsContent } from '../productDetailsContent.types';

export const SMART_WATCHES_CONTENT: readonly ProductDetailsContent[] = [
  {
    slug: 'apple-watch-series-9-45',
    category: 'smart-watches',
    attributes: [
      { label: 'Размер корпуса', value: '45 мм' },
      { label: 'Цвет', value: 'Чёрный' },
    ],
    highlights: [
      'Чип S9 SiP с 4-ядерным Neural Engine',
      'Экран Always-On Retina до 2000 кд/\u2060м²',
      'Жест «Двойное касание»',
      'Датчики ЭКГ, пульса и температуры',
      'Водонепроницаемость до 50 м',
    ],
    description: {
      title: 'Apple Watch на новом чипе S9',
      paragraphs: [
        'Apple Watch Series 9 работают на чипе S9 SiP с 4-ядерным Neural Engine: Siri обрабатывает запросы прямо на часах, а жестом «Двойное касание» можно управлять часами, не прикасаясь к экрану.',
        'Экран Always-On Retina разгоняется до 2000 кд/\u2060м² и опускается до 1 кд/\u2060м² в темноте. Электрический и оптический датчики сердца, датчик температуры и защита до 50 м помогают следить за здоровьем и тренировками.',
      ],
      features: [
        {
          title: 'Чип S9 SiP',
          text: 'Двухъядерный процессор и 4-ядерный Neural Engine.',
          icon: 'settings',
        },
        {
          title: 'Двойное касание',
          text: 'Управление часами двумя касаниями пальцев.',
          icon: 'watch',
        },
        { title: 'Здоровье', text: 'ЭКГ, пульс, температура и отслеживание сна.', icon: 'heart' },
        {
          title: 'До 2000 кд/\u2060м²',
          text: 'Экран хорошо читается даже на ярком солнце.',
          icon: 'lightbulb',
        },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Тип экрана', value: 'Always-On Retina, LTPO OLED', key: true },
          { label: 'Максимальная яркость', value: 'до 2000 кд/\u2060м²', key: true },
          { label: 'Минимальная яркость', value: '1 кд/\u2060м²' },
          { label: 'Плотность пикселей', value: '326 ppi' },
          { label: 'Защитное стекло', value: 'Ion-X' },
        ],
      },
      {
        title: 'Производительность',
        rows: [
          { label: 'Чип', value: 'S9 SiP, 64-битный двухъядерный', key: true },
          { label: 'Neural Engine', value: '4-ядерный' },
          { label: 'Встроенная память', value: '64 ГБ' },
          { label: 'Жест «Двойное касание»', value: 'Есть' },
        ],
      },
      {
        title: 'Здоровье и спорт',
        rows: [
          {
            label: 'Датчики сердца',
            value: 'Электрический и оптический 3-го поколения',
            key: true,
          },
          { label: 'ЭКГ и кислород в крови', value: 'Приложения ЭКГ и «Кислород в крови»' },
          { label: 'Температура', value: 'Датчик температуры' },
          { label: 'Высотомер', value: 'Постоянно включённый' },
          { label: 'Движение', value: 'Акселерометр с высокой перегрузкой, гироскоп, компас' },
        ],
      },
      {
        title: 'Связь',
        rows: [
          { label: 'Bluetooth', value: '5.3' },
          { label: 'Wi-Fi', value: 'Wi-Fi 4 (802.11n)' },
          { label: 'Навигация', value: 'L1 GPS, GNSS, Galileo, BeiDou', key: true },
          { label: 'Оплата', value: 'Apple Pay' },
          { label: 'Ultra Wideband', value: 'Чип 2-го поколения (зависит от региона)' },
        ],
      },
      {
        title: 'Питание',
        rows: [
          { label: 'Время работы', value: 'до 18 ч', key: true },
          { label: 'В режиме энергосбережения', value: 'до 36 ч' },
          { label: 'Быстрая зарядка', value: 'до 80% примерно за 45 мин' },
        ],
      },
      {
        title: 'Корпус',
        rows: [
          { label: 'Размеры', value: '45 × 38 × 10,7 мм', key: true },
          { label: 'Водонепроницаемость', value: 'до 50 м (подходит для плавания)', key: true },
          { label: 'Защита от пыли', value: 'IP6X' },
        ],
      },
      {
        title: 'Совместимость',
        rows: [
          { label: 'Смартфон', value: 'iPhone Xs или новее с iOS 17 или новее', key: true },
          { label: 'Siri', value: 'Обработка запросов на устройстве' },
        ],
      },
    ],
    media: {
      gallery: [
        {
          id: 'apple-watch-s9-black-front',
          source: PRODUCT_DETAILS_APPLE_WATCH_S9_MEDIA,
          alt: 'Apple Watch Series 9, чёрный корпус и спортивный ремешок',
        },
      ],
      cartImage: { kind: 'catalog-fallback' },
    },
  },
];
