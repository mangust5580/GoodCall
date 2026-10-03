import type { ProductDetailsContent } from '../productDetailsContent.types';

export const HEADPHONES_CONTENT: readonly ProductDetailsContent[] = [
  {
    slug: 'airpods-pro-2-usb-c',
    category: 'headphones',
    attributes: [{ label: 'Разъём кейса', value: 'USB-C' }],
    highlights: [
      'Активное шумоподавление',
      'Чип Apple H2',
      'Адаптивный звук и режим прозрачности',
      'До 30 часов прослушивания с кейсом',
      'Защита IP54 для наушников и кейса',
    ],
    description: {
      title: 'Тишина по запросу и звук вокруг',
      paragraphs: [
        'AirPods Pro 2 работают на чипе Apple H2: он управляет активным шумоподавлением, режимом прозрачности и адаптивным звуком, который сам смешивает два режима под обстановку. Персонализированное пространственное аудио отслеживает положение головы.',
        'Наушники играют до 6 часов на одном заряде и до 30 часов с кейсом MagSafe. Кейс заряжается через USB-C, от зарядки MagSafe, Qi или зарядного устройства Apple Watch, а наушники и кейс защищены по IP54.',
      ],
      features: [
        {
          title: 'Шумоподавление',
          text: 'Активное подавление шума на базе чипа H2.',
          icon: 'headphones',
        },
        {
          title: 'Адаптивный звук',
          text: 'Автоматический баланс шумоподавления и прозрачности.',
          icon: 'settings',
        },
        { title: 'До 30 часов', text: '6 часов в наушниках и ещё больше с кейсом.', icon: 'clock' },
        {
          title: 'Кейс MagSafe',
          text: 'USB-C, MagSafe, Qi и встроенный динамик.',
          icon: 'package',
        },
      ],
    },
    specificationGroups: [
      {
        title: 'Звук',
        rows: [
          { label: 'Конструкция', value: 'Внутриканальные', key: true },
          { label: 'Активное шумоподавление', value: 'Есть', key: true },
          { label: 'Адаптивный звук', value: 'Есть' },
          { label: 'Режим прозрачности', value: 'Есть' },
          { label: 'Пространственное аудио', value: 'Персонализированное, с отслеживанием головы' },
          { label: 'Излучатель', value: 'Динамик Apple с высокой амплитудой хода' },
        ],
      },
      {
        title: 'Управление и чип',
        rows: [
          { label: 'Чип', value: 'Apple H2', key: true },
          { label: 'Управление', value: 'Сенсорное' },
          { label: 'Микрофоны', value: 'Два с формированием луча и внутренний' },
          { label: 'Датчики', value: 'Датчик контакта с кожей, акселерометры' },
        ],
      },
      {
        title: 'Питание',
        rows: [
          { label: 'Прослушивание', value: 'до 6 ч на одном заряде', key: true },
          { label: 'С кейсом', value: 'до 30 ч', key: true },
          { label: 'Быстрая зарядка', value: '5 мин в кейсе — около 1 ч прослушивания' },
          { label: 'Зарядка кейса', value: 'USB-C, MagSafe, Qi, зарядка Apple Watch', key: true },
        ],
      },
      {
        title: 'Связь',
        rows: [
          { label: 'Bluetooth', value: '5.3', key: true },
          { label: 'Поиск кейса', value: 'Чип U1 и встроенный динамик' },
        ],
      },
      {
        title: 'Корпус и защита',
        rows: [
          { label: 'Защита', value: 'IP54 — наушники и кейс', key: true },
          { label: 'Вес наушника', value: '5,3 г' },
          { label: 'Вес кейса', value: '50,8 г' },
          { label: 'Размеры наушника', value: '30,9 × 21,8 × 24 мм' },
          { label: 'Размеры кейса', value: '45,2 × 60,6 × 21,7 мм' },
        ],
      },
      {
        title: 'Совместимость',
        rows: [
          { label: 'Apple', value: 'iPhone и другие устройства Apple с актуальной ОС' },
          { label: 'Другие устройства', value: 'Базовое подключение по Bluetooth' },
        ],
      },
    ],
  },
];
