import {
  PRODUCT_DETAILS_DESCRIPTION_MEDIA,
  PRODUCT_DETAILS_GALLERY_BY_COLOUR_MEDIA,
  PRODUCT_DETAILS_WARRANTY_MEDIA,
} from '../../../assets/media/product-details/productDetailsMedia';
import type { ProductDetailsContent } from '../productDetailsContent';

const NITS = 'кд/\u2060м²';
const IPHONE_15_PINK = PRODUCT_DETAILS_GALLERY_BY_COLOUR_MEDIA.pink;
const IPHONE_15_ALT = 'Apple iPhone 15, розовый';

export const SMARTPHONES_CONTENT: readonly ProductDetailsContent[] = [
  {
    slug: 'iphone-15-128',
    category: 'smartphones',
    attributes: [
      { label: 'Цвет', value: 'Розовый' },
      { label: 'Память', value: '128 ГБ' },
    ],
    highlights: [
      'Dynamic Island вместо выреза',
      'Основная камера 48 МП',
      'Разъём USB-C',
      'Процессор A16 Bionic',
      'Дисплей Super Retina XDR 6,1″',
    ],
    description: {
      title: 'Знакомый iPhone, заметно новее',
      paragraphs: [
        'iPhone 15 получил Dynamic Island, основную камеру 48 МП и разъём USB-C. Корпус из алюминия и стекла с окрашенной массой остаётся компактным и лёгким — всего 171 г.',
        'Процессор A16 Bionic уверенно справляется с приложениями, играми и обработкой фото, а дисплей Super Retina XDR разгоняется до 2000 кд/\u2060м² на улице и остаётся читаемым даже на ярком солнце.',
      ],
      features: [
        {
          title: 'Dynamic Island',
          text: 'Уведомления и активные действия вокруг фронтальной камеры.',
          icon: 'smartphone',
        },
        {
          title: 'Камера 48 МП',
          text: 'Детальные снимки и двукратное приближение за счёт сенсора 48 МП.',
          icon: 'camera',
        },
        {
          title: 'Разъём USB-C',
          text: 'Один кабель для зарядки и передачи данных.',
          icon: 'accessories',
        },
        {
          title: 'A16 Bionic',
          text: '6-ядерный процессор и 5-ядерная графика для приложений и игр.',
          icon: 'settings',
        },
        {
          title: 'Super Retina XDR',
          text: `OLED-дисплей 6,1″ с яркостью до 2000 ${NITS} на улице.`,
          icon: 'tv',
        },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '6,1″', key: true },
          { label: 'Тип экрана', value: 'Super Retina XDR, OLED', key: true },
          { label: 'Разрешение', value: '2556 × 1179, 460 ppi', key: true },
          { label: 'Максимальная яркость', value: `до 2000 ${NITS} (на улице)` },
          { label: 'Технологии', value: 'HDR, True Tone, широкий цветовой охват P3' },
        ],
      },
      {
        title: 'Производительность',
        rows: [
          { label: 'Процессор', value: 'A16 Bionic', key: true },
          { label: 'Ядра', value: '6-ядерный CPU, 5-ядерный GPU' },
          { label: 'Встроенная память', value: '128 ГБ', key: true },
        ],
      },
      {
        title: 'Камеры',
        rows: [
          { label: 'Основная камера', value: '48 МП + 12 МП', key: true },
          { label: 'Основной модуль', value: '48 МП, ƒ/1.6' },
          { label: 'Сверхширокоугольный модуль', value: '12 МП, ƒ/2.4' },
          { label: 'Фронтальная камера', value: '12 МП, ƒ/1.9', key: true },
          { label: 'Видео', value: '4K Dolby Vision, до 60 кадров/с' },
        ],
      },
      {
        title: 'Питание',
        rows: [
          { label: 'Воспроизведение видео', value: 'до 20 ч', key: true },
          { label: 'Быстрая зарядка', value: 'до 50% примерно за 30 мин (адаптер 20 Вт)' },
          { label: 'Беспроводная зарядка', value: 'MagSafe и Qi2 до 15 Вт' },
        ],
      },
      {
        title: 'Связь и интерфейсы',
        rows: [
          { label: 'Разъём', value: 'USB-C (USB 2)', key: true },
          { label: 'Сети', value: '5G' },
          { label: 'Wi-Fi', value: 'Wi-Fi 6 (802.11ax)' },
          { label: 'Bluetooth', value: '5.3' },
          { label: 'NFC', value: 'Есть' },
        ],
      },
      {
        title: 'Корпус',
        rows: [
          { label: 'Защита от воды и пыли', value: 'IP68 (до 6 м, до 30 мин)', key: true },
          { label: 'Размеры', value: '147,6 × 71,6 × 7,8 мм' },
          { label: 'Вес', value: '171 г' },
          { label: 'Материалы', value: 'Алюминий, Ceramic Shield, стекло с окрашенной массой' },
        ],
      },
      {
        title: 'Система',
        rows: [
          { label: 'Операционная система', value: 'iOS' },
          { label: 'Разблокировка', value: 'Face ID' },
          {
            label: 'Безопасность',
            value: 'Экстренный вызов SOS через спутник, распознавание аварии',
          },
        ],
      },
    ],
    media: {
      gallery: [
        {
          id: 'pink-hero-front',
          source: IPHONE_15_PINK.heroFront,
          alt: `${IPHONE_15_ALT}, вид спереди под углом`,
        },
        {
          id: 'pink-rear-camera',
          source: IPHONE_15_PINK.rearCamera,
          alt: `${IPHONE_15_ALT}, вид сзади`,
        },
        {
          id: 'pink-side-profile',
          source: IPHONE_15_PINK.sideProfile,
          alt: `${IPHONE_15_ALT}, вид сбоку`,
        },
        {
          id: 'pink-front-rear-pair',
          source: IPHONE_15_PINK.frontRearPair,
          alt: `${IPHONE_15_ALT}, спереди и сзади`,
        },
        {
          id: 'pink-camera-detail',
          source: IPHONE_15_PINK.cameraDetail,
          alt: `${IPHONE_15_ALT}, крупный план камеры и корпуса`,
        },
      ],
      editorial: PRODUCT_DETAILS_DESCRIPTION_MEDIA,
      warranty: PRODUCT_DETAILS_WARRANTY_MEDIA,
      cartImage: { kind: 'product-details', colourId: 'pink' },
    },
  },
  {
    slug: 'iphone-15-pro-128',
    category: 'smartphones',
    attributes: [
      { label: 'Цвет', value: 'Натуральный титан' },
      { label: 'Память', value: '128 ГБ' },
    ],
    highlights: [
      'Титановый корпус весом 187 г',
      'Процессор A17 Pro',
      'Телеобъектив с 3× оптическим зумом',
      'Дисплей ProMotion до 120 Гц',
      'USB-C со скоростью USB 3',
      'Настраиваемая кнопка действия',
    ],
    description: {
      title: 'Pro-возможности в компактном титане',
      paragraphs: [
        'iPhone 15 Pro собран в титановой рамке и весит 187 г. Дисплей ProMotion 6,1″ меняет частоту обновления до 120 Гц и умеет работать в режиме «Всегда включён», а кнопка действия запускает выбранную функцию одним нажатием.',
        'Процессор A17 Pro с 6-ядерной графикой рассчитан на тяжёлые игры и монтаж. Тройная камера с основным модулем 48 МП и телеобъективом 3× закрывает большинство сюжетов, а USB-C работает на скорости USB 3 до 10 Гбит/с.',
      ],
      features: [
        { title: 'Титан', text: 'Прочная и лёгкая рамка корпуса из титана.', icon: 'smartphone' },
        {
          title: 'A17 Pro',
          text: '6-ядерный CPU и 6-ядерный GPU для игр и монтажа.',
          icon: 'settings',
        },
        {
          title: 'Телеобъектив 3×',
          text: '12 МП и фокусное расстояние 77 мм для портретов.',
          icon: 'camera',
        },
        {
          title: 'ProMotion',
          text: 'Адаптивная частота до 120 Гц и режим «Всегда включён».',
          icon: 'tv',
        },
        {
          title: 'USB 3',
          text: 'Передача файлов по USB-C со скоростью до 10 Гбит/с.',
          icon: 'accessories',
        },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '6,1″', key: true },
          { label: 'Тип экрана', value: 'Super Retina XDR, OLED, ProMotion', key: true },
          { label: 'Разрешение', value: '2556 × 1179, 460 ppi', key: true },
          { label: 'Частота обновления', value: 'до 120 Гц', key: true },
          { label: 'Максимальная яркость', value: `до 2000 ${NITS} (на улице)` },
          { label: 'Режим «Всегда включён»', value: 'Есть' },
        ],
      },
      {
        title: 'Производительность',
        rows: [
          { label: 'Процессор', value: 'A17 Pro', key: true },
          { label: 'Ядра', value: '6-ядерный CPU, 6-ядерный GPU' },
          { label: 'Встроенная память', value: '128 ГБ', key: true },
        ],
      },
      {
        title: 'Камеры',
        rows: [
          { label: 'Основная камера', value: '48 МП, ƒ/1.78', key: true },
          { label: 'Сверхширокоугольная камера', value: '12 МП, ƒ/2.2' },
          { label: 'Телеобъектив', value: '12 МП, 3× оптический зум, ƒ/2.8', key: true },
          { label: 'Фронтальная камера', value: '12 МП, ƒ/1.9' },
          { label: 'Видео', value: '4K, до 60 кадров/с' },
        ],
      },
      {
        title: 'Питание',
        rows: [
          { label: 'Воспроизведение видео', value: 'до 23 ч', key: true },
          { label: 'Быстрая зарядка', value: 'до 50% примерно за 30 мин' },
          { label: 'Беспроводная зарядка', value: 'MagSafe до 15 Вт, Qi до 7,5 Вт' },
        ],
      },
      {
        title: 'Связь и интерфейсы',
        rows: [
          { label: 'Разъём', value: 'USB-C (USB 3, до 10 Гбит/с)', key: true },
          { label: 'Wi-Fi', value: 'Wi-Fi 6E' },
          { label: 'Bluetooth', value: '5.3' },
          { label: 'NFC', value: 'Есть' },
        ],
      },
      {
        title: 'Корпус',
        rows: [
          { label: 'Защита от воды и пыли', value: 'IP68 (до 6 м, до 30 мин)', key: true },
          { label: 'Материал рамки', value: 'Титан' },
          { label: 'Размеры', value: '146,6 × 70,6 × 8,25 мм' },
          { label: 'Вес', value: '187 г' },
        ],
      },
      {
        title: 'Система',
        rows: [
          { label: 'Операционная система', value: 'iOS' },
          { label: 'Разблокировка', value: 'Face ID' },
          { label: 'Кнопка действия', value: 'Настраиваемая' },
        ],
      },
    ],
  },
  {
    slug: 'galaxy-s24-128',
    category: 'smartphones',
    attributes: [
      { label: 'Цвет', value: 'Фиолетовый' },
      { label: 'Память', value: '128 ГБ' },
    ],
    highlights: [
      'Компактный экран Dynamic AMOLED 2X 6,2″',
      'Тройная камера с 3× оптическим зумом',
      'Видеосъёмка в 8K',
      'Стекло Gorilla Glass Victus 2',
      'Рамка из Armor Aluminum',
    ],
    description: {
      title: 'Флагман, который удобно держать',
      paragraphs: [
        'Galaxy S24 укладывает флагманскую начинку в корпус с экраном 6,2″ и весом 167 г. Дисплей Dynamic AMOLED 2X с частотой до 120 Гц и функцией Vision Booster разгоняется до 2600 кд/\u2060м² и остаётся читаемым на солнце.',
        'Тройная камера сочетает основной модуль 50 МП, сверхширокоугольный 12 МП и телеобъектив 10 МП с трёхкратным оптическим зумом, а видео можно снимать в 8K. Экран защищён стеклом Gorilla Glass Victus 2, рамка — из Armor Aluminum.',
      ],
      features: [
        { title: 'Dynamic AMOLED 2X', text: 'Плавная картинка с частотой до 120 Гц.', icon: 'tv' },
        { title: 'Зум 3×', text: 'Телеобъектив 10 МП для съёмки издалека.', icon: 'camera' },
        { title: 'Видео 8K', text: 'Запись роликов в разрешении 7680 × 4320.', icon: 'smartphone' },
        {
          title: 'Victus 2',
          text: 'Экран под защитой Corning Gorilla Glass Victus 2.',
          icon: 'check',
        },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '6,2″', key: true },
          { label: 'Тип экрана', value: 'Dynamic AMOLED 2X', key: true },
          { label: 'Разрешение', value: '2340 × 1080 (FHD+)', key: true },
          { label: 'Частота обновления', value: 'до 120 Гц', key: true },
          { label: 'Максимальная яркость', value: `2600 ${NITS} (Vision Booster)` },
          { label: 'Защитное стекло', value: 'Corning Gorilla Glass Victus 2' },
        ],
      },
      {
        title: 'Производительность',
        rows: [
          { label: 'Процессор', value: '10-ядерный, до 3,2 ГГц', key: true },
          { label: 'Оперативная память', value: '8 ГБ', key: true },
          { label: 'Встроенная память', value: '128 ГБ', key: true },
        ],
      },
      {
        title: 'Камеры',
        rows: [
          { label: 'Основная камера', value: '50 МП + 12 МП + 10 МП', key: true },
          { label: 'Диафрагма', value: 'ƒ/1.8, ƒ/2.2, ƒ/2.4' },
          { label: 'Оптический зум', value: '3×' },
          { label: 'Фронтальная камера', value: '12 МП, ƒ/2.2' },
          { label: 'Видео', value: '8K (7680 × 4320), 30 кадров/с' },
        ],
      },
      {
        title: 'Питание',
        rows: [
          { label: 'Аккумулятор', value: '4000 мА·ч', key: true },
          { label: 'Быстрая зарядка', value: 'Super Fast Charging' },
        ],
      },
      {
        title: 'Связь и интерфейсы',
        rows: [
          { label: 'Разъём', value: 'USB Type-C (USB 3.2 Gen 1)' },
          { label: 'Wi-Fi', value: '802.11 a/b/g/n/ac/ax, 2,4/5/6 ГГц' },
          { label: 'Bluetooth', value: '5.3' },
          { label: 'NFC', value: 'Есть' },
          { label: 'Навигация', value: 'GPS, ГЛОНАСС, BeiDou, Galileo, QZSS' },
          { label: 'SIM-карты', value: 'Nano-SIM и eSIM' },
        ],
      },
      {
        title: 'Корпус',
        rows: [
          { label: 'Размеры', value: '147 × 70,6 × 7,6 мм' },
          { label: 'Вес', value: '167 г' },
          { label: 'Материал рамки', value: 'Armor Aluminum' },
        ],
      },
      {
        title: 'Система',
        rows: [
          { label: 'Операционная система', value: 'Android' },
          { label: 'Сканер отпечатка пальца', value: 'Есть' },
          { label: 'Датчики', value: 'Акселерометр, барометр, гироскоп, датчик Холла' },
        ],
      },
    ],
  },
  {
    slug: 'galaxy-a55-128',
    category: 'smartphones',
    attributes: [
      { label: 'Цвет', value: 'Лиловый' },
      { label: 'Память', value: '128 ГБ' },
    ],
    highlights: [
      'Экран Super AMOLED 6,6″, 120 Гц',
      'Основная камера 50 МП со стабилизацией',
      'Аккумулятор 5000 мА·ч',
      'Защита от воды и пыли IP67',
      'Стекло Gorilla Glass Victus+',
    ],
    description: {
      title: 'Надёжный Galaxy на каждый день',
      paragraphs: [
        'Galaxy A55 получил металлическую рамку, стекло Gorilla Glass Victus+ и защиту IP67: смартфон выдерживает погружение в пресную воду на глубину до 1 м на 30 минут. Экран Super AMOLED 6,6″ работает с частотой 120 Гц.',
        'Основная камера 50 МП с оптической стабилизацией дополнена сверхширокоугольным модулем 12 МП и макрокамерой 5 МП, а фронтальная — 32 МП. Аккумулятор 5000 мА·ч рассчитан до 28 часов воспроизведения видео.',
      ],
      features: [
        { title: 'Super AMOLED 120 Гц', text: 'Плавная прокрутка на экране 6,6″.', icon: 'tv' },
        {
          title: 'Камера 50 МП',
          text: 'Оптическая стабилизация основного модуля.',
          icon: 'camera',
        },
        { title: 'IP67', text: 'Защита от пыли и погружения в воду до 1 м.', icon: 'check' },
        { title: '5000 мА·ч', text: 'До 28 часов воспроизведения видео.', icon: 'clock' },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '6,6″', key: true },
          { label: 'Тип экрана', value: 'Super AMOLED', key: true },
          { label: 'Разрешение', value: '2340 × 1080 (FHD+)', key: true },
          { label: 'Частота обновления', value: '120 Гц', key: true },
          { label: 'Защитное стекло', value: 'Corning Gorilla Glass Victus+' },
        ],
      },
      {
        title: 'Производительность',
        rows: [
          { label: 'Процессор', value: '8-ядерный, 2,75 + 2 ГГц', key: true },
          { label: 'Оперативная память', value: '8 ГБ', key: true },
          { label: 'Встроенная память', value: '128 ГБ', key: true },
          { label: 'Карта памяти', value: 'microSD до 1 ТБ' },
        ],
      },
      {
        title: 'Камеры',
        rows: [
          { label: 'Основная камера', value: '50 МП + 12 МП + 5 МП', key: true },
          { label: 'Стабилизация', value: 'Оптическая (OIS)' },
          { label: 'Фронтальная камера', value: '32 МП, ƒ/2.2' },
          { label: 'Видео', value: '4K, 30 кадров/с' },
        ],
      },
      {
        title: 'Питание',
        rows: [
          { label: 'Аккумулятор', value: '5000 мА·ч', key: true },
          { label: 'Воспроизведение видео', value: 'до 28 ч' },
          { label: 'Быстрая зарядка', value: 'Поддерживается' },
        ],
      },
      {
        title: 'Связь и интерфейсы',
        rows: [
          { label: 'Разъём', value: 'USB Type-C (USB 2.0)' },
          { label: 'Wi-Fi', value: '802.11 a/b/g/n/ac/ax' },
          { label: 'Bluetooth', value: '5.3' },
          { label: 'NFC', value: 'Есть' },
          { label: 'Навигация', value: 'GPS, ГЛОНАСС, BeiDou, Galileo, QZSS' },
        ],
      },
      {
        title: 'Корпус',
        rows: [
          { label: 'Защита от воды и пыли', value: 'IP67 (до 1 м, до 30 мин)', key: true },
          { label: 'Размеры', value: '161,1 × 77,4 × 8,2 мм' },
          { label: 'Вес', value: '213 г' },
          { label: 'Рамка', value: 'Металлическая' },
        ],
      },
      {
        title: 'Система',
        rows: [
          { label: 'Операционная система', value: 'Android' },
          { label: 'Сканер отпечатка пальца', value: 'Есть' },
          { label: 'SIM-карты', value: 'Nano-SIM и eSIM' },
        ],
      },
    ],
  },
  {
    slug: 'pixel-8-128',
    category: 'smartphones',
    attributes: [
      { label: 'Цвет', value: 'Обсидиан' },
      { label: 'Память', value: '128 ГБ' },
    ],
    highlights: [
      'Процессор Google Tensor G3',
      'Экран Actua 6,2″ до 2000 кд/\u2060м²',
      'Основная камера 50 МП',
      'Защита от воды и пыли IP68',
      '7 лет обновлений ОС и безопасности',
    ],
    description: {
      title: 'Pixel с собственным чипом Google',
      paragraphs: [
        'Pixel 8 построен на процессоре Google Tensor G3 с сопроцессором безопасности Titan M2. Компактный экран Actua 6,2″ меняет частоту от 60 до 120 Гц и разгоняется до 2000 кд/\u2060м², а корпус защищён по стандарту IP68.',
        'Основная камера 50 МП работает в паре со сверхширокоугольным модулем 12 МП с автофокусом. Google обещает для Pixel 8 семь лет обновлений ОС и безопасности, так что смартфон долго остаётся актуальным.',
      ],
      features: [
        {
          title: 'Tensor G3',
          text: 'Собственный процессор Google и чип Titan M2.',
          icon: 'settings',
        },
        { title: 'Экран Actua', text: 'До 2000 кд/\u2060м² и частота 60–120 Гц.', icon: 'tv' },
        {
          title: 'Камера 50 МП',
          text: 'Основной модуль и сверхширик 12 МП с автофокусом.',
          icon: 'camera',
        },
        {
          title: '7 лет обновлений',
          text: 'Обновления ОС, безопасности и Feature Drops.',
          icon: 'check',
        },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '6,2″', key: true },
          { label: 'Тип экрана', value: 'OLED, Actua', key: true },
          { label: 'Разрешение', value: '2400 × 1080, 428 ppi', key: true },
          { label: 'Частота обновления', value: '60–120 Гц', key: true },
          { label: 'Максимальная яркость', value: `до 2000 ${NITS} (пиковая)` },
          { label: 'Защитное стекло', value: 'Corning Gorilla Glass Victus' },
        ],
      },
      {
        title: 'Производительность',
        rows: [
          { label: 'Процессор', value: 'Google Tensor G3', key: true },
          { label: 'Сопроцессор безопасности', value: 'Titan M2' },
          { label: 'Оперативная память', value: '8 ГБ', key: true },
          { label: 'Встроенная память', value: '128 ГБ', key: true },
        ],
      },
      {
        title: 'Камеры',
        rows: [
          { label: 'Основная камера', value: '50 МП', key: true },
          { label: 'Сверхширокоугольная камера', value: '12 МП, автофокус' },
          { label: 'Фронтальная камера', value: '10,5 МП' },
        ],
      },
      {
        title: 'Питание',
        rows: [
          { label: 'Аккумулятор', value: '4575 мА·ч (типичная ёмкость)', key: true },
          { label: 'Быстрая зарядка', value: 'до 50% примерно за 30 мин (адаптер 30 Вт)' },
          { label: 'Беспроводная зарядка', value: 'Qi' },
        ],
      },
      {
        title: 'Связь и интерфейсы',
        rows: [
          { label: 'Разъём', value: 'USB Type-C' },
          { label: 'Wi-Fi', value: 'Wi-Fi 7 (802.11be)' },
          { label: 'Bluetooth', value: '5.3' },
        ],
      },
      {
        title: 'Корпус',
        rows: [
          { label: 'Защита от воды и пыли', value: 'IP68', key: true },
          { label: 'Размеры', value: '150,5 × 70,8 × 8,9 мм' },
          { label: 'Вес', value: '187 г' },
          { label: 'Рамка', value: 'Матовый алюминий' },
        ],
      },
      {
        title: 'Система',
        rows: [
          { label: 'Операционная система', value: 'Android' },
          { label: 'Обновления', value: '7 лет обновлений ОС и безопасности' },
        ],
      },
    ],
  },
  {
    slug: 'xiaomi-14-256',
    category: 'smartphones',
    attributes: [
      { label: 'Цвет', value: 'Чёрный' },
      { label: 'ОЗУ', value: '12 ГБ' },
      { label: 'Память', value: '256 ГБ' },
    ],
    highlights: [
      'Snapdragon 8 Gen 3',
      'Три камеры 50 МП с оптикой Leica',
      'Экран LTPO 6,36″ до 3000 кд/\u2060м²',
      'Зарядка 90 Вт и беспроводная 50 Вт',
      'Защита IP68',
    ],
    description: {
      title: 'Компактный флагман с оптикой Leica',
      paragraphs: [
        'Xiaomi 14 сочетает компактный экран 6,36″ с флагманским Snapdragon 8 Gen 3 и памятью LPDDR5X и UFS 4.0. Дисплей LTPO меняет частоту от 1 до 120 Гц, а пиковая яркость достигает 3000 кд/\u2060м².',
        'Камера с оптикой Leica объединяет основной модуль 50 МП с диафрагмой ƒ/1.6, телеобъектив 75 мм и сверхширокоугольную камеру 50 МП. Аккумулятор 4610 мА·ч заряжается кабелем на 90 Вт и без проводов на 50 Вт.',
      ],
      features: [
        { title: 'Оптика Leica', text: 'Три камеры 50 МП и телеобъектив 75 мм.', icon: 'camera' },
        {
          title: 'Snapdragon 8 Gen 3',
          text: 'Флагманский процессор и память UFS 4.0.',
          icon: 'settings',
        },
        { title: 'LTPO 1–120 Гц', text: 'Яркость до 3000 кд/\u2060м² и Dolby Vision.', icon: 'tv' },
        {
          title: '90 Вт HyperCharge',
          text: 'Быстрая проводная и беспроводная зарядка.',
          icon: 'clock',
        },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '6,36″', key: true },
          { label: 'Тип экрана', value: 'AMOLED, LTPO', key: true },
          { label: 'Разрешение', value: '2670 × 1200, 460 ppi', key: true },
          { label: 'Частота обновления', value: '1–120 Гц', key: true },
          { label: 'Пиковая яркость', value: `3000 ${NITS}` },
          { label: 'HDR', value: 'Dolby Vision, HDR10+' },
        ],
      },
      {
        title: 'Производительность',
        rows: [
          { label: 'Процессор', value: 'Snapdragon 8 Gen 3', key: true },
          { label: 'Оперативная память', value: '12 ГБ LPDDR5X', key: true },
          { label: 'Встроенная память', value: '256 ГБ UFS 4.0', key: true },
        ],
      },
      {
        title: 'Камеры',
        rows: [
          { label: 'Основная камера', value: '50 МП, ƒ/1.6, Leica', key: true },
          { label: 'Телеобъектив', value: '75 мм, ƒ/2.0' },
          { label: 'Сверхширокоугольная камера', value: '50 МП, 115°' },
          { label: 'Фронтальная камера', value: '32 МП, ƒ/2.0' },
          { label: 'Видео', value: '8K, 24 кадра/с' },
        ],
      },
      {
        title: 'Питание',
        rows: [
          { label: 'Аккумулятор', value: '4610 мА·ч', key: true },
          { label: 'Проводная зарядка', value: '90 Вт HyperCharge' },
          { label: 'Беспроводная зарядка', value: '50 Вт' },
        ],
      },
      {
        title: 'Связь и интерфейсы',
        rows: [
          { label: 'Разъём', value: 'USB-C (USB 3.2 Gen 1)' },
          { label: 'Wi-Fi', value: 'Wi-Fi 7' },
          { label: 'Bluetooth', value: '5.4' },
          { label: 'NFC', value: 'Есть' },
        ],
      },
      {
        title: 'Корпус',
        rows: [
          { label: 'Защита от воды и пыли', value: 'IP68', key: true },
          { label: 'Размеры', value: '152,8 × 71,5 × 8,2 мм' },
          { label: 'Вес', value: '193 г' },
        ],
      },
      {
        title: 'Система',
        rows: [
          { label: 'Операционная система', value: 'Xiaomi HyperOS' },
          { label: 'Сканер отпечатка пальца', value: 'В экране' },
        ],
      },
    ],
  },
  {
    slug: 'redmi-note-13-pro-256',
    category: 'smartphones',
    attributes: [
      { label: 'Цвет', value: 'Синий' },
      { label: 'Память', value: '256 ГБ' },
    ],
    highlights: [
      'Основная камера 200 МП со стабилизацией',
      'Экран AMOLED 6,67″, 120 Гц',
      'Зарядка 67 Вт',
      'Аккумулятор 5000 мА·ч',
      'Защита IP54',
    ],
    description: {
      title: '200 мегапикселей за разумные деньги',
      paragraphs: [
        'Redmi Note 13 Pro получил основную камеру 200 МП с оптической стабилизацией и технологией объединения 16 пикселей в один. Рядом — сверхширокоугольный модуль 8 МП и макрокамера 2 МП, а фронтальная камера — 16 МП.',
        'Экран AMOLED 6,67″ работает с частотой до 120 Гц и пиковой яркостью 1300 кд/\u2060м², защищён стеклом Gorilla Glass 5. Процессор Helio G99-Ultra, аккумулятор 5000 мА·ч и зарядка 67 Вт рассчитаны на насыщенный день.',
      ],
      features: [
        {
          title: 'Камера 200 МП',
          text: 'Оптическая стабилизация основного модуля.',
          icon: 'camera',
        },
        { title: 'AMOLED 120 Гц', text: 'Пиковая яркость 1300 кд/\u2060м².', icon: 'tv' },
        { title: '67 Вт', text: 'Быстрая зарядка аккумулятора 5000 мА·ч.', icon: 'clock' },
        {
          title: 'ИК-порт и NFC',
          text: 'Пульт для техники и бесконтактные сервисы.',
          icon: 'smartphone',
        },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '6,67″', key: true },
          { label: 'Тип экрана', value: 'AMOLED', key: true },
          { label: 'Разрешение', value: '2400 × 1080', key: true },
          { label: 'Частота обновления', value: 'до 120 Гц', key: true },
          { label: 'Пиковая яркость', value: `1300 ${NITS}` },
          { label: 'Защитное стекло', value: 'Corning Gorilla Glass 5' },
        ],
      },
      {
        title: 'Производительность',
        rows: [
          { label: 'Процессор', value: 'MediaTek Helio G99-Ultra', key: true },
          { label: 'Оперативная память', value: '8 ГБ', key: true },
          { label: 'Встроенная память', value: '256 ГБ', key: true },
          { label: 'Карта памяти', value: 'microSD до 1 ТБ' },
        ],
      },
      {
        title: 'Камеры',
        rows: [
          { label: 'Основная камера', value: '200 МП + 8 МП + 2 МП', key: true },
          { label: 'Основной модуль', value: '200 МП, ƒ/1.65, OIS' },
          { label: 'Фронтальная камера', value: '16 МП, ƒ/2.4' },
          { label: 'Видео', value: '1080p, до 60 кадров/с' },
        ],
      },
      {
        title: 'Питание',
        rows: [
          { label: 'Аккумулятор', value: '5000 мА·ч', key: true },
          { label: 'Быстрая зарядка', value: '67 Вт' },
        ],
      },
      {
        title: 'Связь и интерфейсы',
        rows: [
          { label: 'Разъём', value: 'USB-C' },
          { label: 'Wi-Fi', value: '802.11 a/b/g/n/ac' },
          { label: 'Bluetooth', value: '5.2' },
          { label: 'NFC', value: 'Есть' },
          { label: 'ИК-порт', value: 'Есть' },
          { label: 'Разъём для наушников', value: '3,5 мм' },
        ],
      },
      {
        title: 'Корпус',
        rows: [
          { label: 'Защита от воды и пыли', value: 'IP54' },
          { label: 'Размеры', value: '161,1 × 74,95 × 7,98 мм' },
          { label: 'Вес', value: '188 г' },
        ],
      },
      {
        title: 'Система',
        rows: [
          { label: 'Операционная система', value: 'MIUI 14' },
          { label: 'Сканер отпечатка пальца', value: 'В экране' },
        ],
      },
    ],
  },
  {
    slug: 'poco-f6-256',
    category: 'smartphones',
    attributes: [
      { label: 'Цвет', value: 'Чёрный' },
      { label: 'ОЗУ', value: '12 ГБ' },
      { label: 'Память', value: '256 ГБ' },
    ],
    highlights: [
      'Snapdragon 8s Gen 3',
      'Экран Flow AMOLED 1.5K, 120 Гц',
      'Камера 50 МП Sony IMX882',
      'Зарядка 90 Вт',
      'Память LPDDR5X и UFS 4.0',
    ],
    description: {
      title: 'Флагманская производительность без переплаты',
      paragraphs: [
        'POCO F6 построен на Snapdragon 8s Gen 3 с памятью LPDDR5X и UFS 4.0 — это уровень производительности, рассчитанный на тяжёлые игры. Экран Flow AMOLED 1.5K 6,67″ работает на 120 Гц и выдаёт до 2400 кд/\u2060м².',
        'Основная камера 50 МП на сенсоре Sony IMX882 снимает видео в 4K до 60 кадров/с, а аккумулятор 5000 мА·ч заряжается мощностью 90 Вт. Экран защищён стеклом Gorilla Glass Victus.',
      ],
      features: [
        { title: 'Snapdragon 8s Gen 3', text: '8 ядер с частотой до 3,0 ГГц.', icon: 'settings' },
        {
          title: 'Flow AMOLED 1.5K',
          text: '2712 × 1220 и пиковая яркость 2400 кд/\u2060м².',
          icon: 'tv',
        },
        {
          title: 'Sony IMX882',
          text: 'Основная камера 50 МП, видео 4K 60 кадров/с.',
          icon: 'camera',
        },
        { title: '90 Вт', text: 'Быстрая зарядка аккумулятора 5000 мА·ч.', icon: 'clock' },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '6,67″', key: true },
          { label: 'Тип экрана', value: 'Flow AMOLED, 1.5K', key: true },
          { label: 'Разрешение', value: '2712 × 1220, 446 ppi', key: true },
          { label: 'Частота обновления', value: 'до 120 Гц', key: true },
          { label: 'Пиковая яркость', value: `2400 ${NITS}` },
          { label: 'Защитное стекло', value: 'Corning Gorilla Glass Victus' },
        ],
      },
      {
        title: 'Производительность',
        rows: [
          { label: 'Процессор', value: 'Snapdragon 8s Gen 3', key: true },
          { label: 'Частота', value: '8 ядер, до 3,0 ГГц' },
          { label: 'Оперативная память', value: '12 ГБ LPDDR5X', key: true },
          { label: 'Встроенная память', value: '256 ГБ UFS 4.0', key: true },
        ],
      },
      {
        title: 'Камеры',
        rows: [
          { label: 'Основная камера', value: '50 МП, Sony IMX882, ƒ/1.59', key: true },
          { label: 'Сверхширокоугольная камера', value: '8 МП' },
          { label: 'Фронтальная камера', value: '20 МП, ƒ/2.2' },
          { label: 'Видео', value: '4K, до 60 кадров/с' },
        ],
      },
      {
        title: 'Питание',
        rows: [
          { label: 'Аккумулятор', value: '5000 мА·ч', key: true },
          { label: 'Быстрая зарядка', value: '90 Вт' },
        ],
      },
      {
        title: 'Связь и интерфейсы',
        rows: [
          { label: 'Разъём', value: 'USB-C' },
          { label: 'Wi-Fi', value: '802.11 a/b/g/n/ac/ax' },
          { label: 'Bluetooth', value: '5.4' },
          { label: 'NFC', value: 'Есть' },
          { label: 'ИК-порт', value: 'Есть' },
        ],
      },
      {
        title: 'Корпус',
        rows: [
          { label: 'Размеры', value: '160,5 × 74,4 × 7,8 мм' },
          { label: 'Вес', value: '179 г' },
        ],
      },
      {
        title: 'Система',
        rows: [
          { label: 'Операционная система', value: 'Xiaomi HyperOS' },
          { label: 'Сканер отпечатка пальца', value: 'В экране' },
        ],
      },
    ],
  },
  {
    slug: 'oneplus-12-256',
    category: 'smartphones',
    attributes: [
      { label: 'Цвет', value: 'Сланец' },
      { label: 'ОЗУ', value: '12 ГБ' },
      { label: 'Память', value: '256 ГБ' },
    ],
    highlights: [
      'Snapdragon 8 Gen 3',
      'Экран ProXDR 2K 6,82″ с LTPO',
      'Камера Hasselblad и перископ 3×',
      'Аккумулятор 5400 мА·ч',
      'Зарядка 80 Вт и беспроводная 50 Вт',
    ],
    description: {
      title: 'Большой экран и камера Hasselblad',
      paragraphs: [
        'OnePlus 12 получил экран ProXDR 6,82″ с разрешением QHD+ и технологией LTPO: частота меняется от 1 до 120 Гц, а пиковая яркость достигает 4500 кд/\u2060м². Внутри — Snapdragon 8 Gen 3, LPDDR5X и UFS 4.0.',
        'Камера Hasselblad объединяет основной модуль 50 МП на сенсоре Sony LYT-808, перископный телеобъектив 64 МП с трёхкратным оптическим зумом и сверхширокоугольную камеру 48 МП. Аккумулятор 5400 мА·ч заряжается мощностью 80 Вт.',
      ],
      features: [
        { title: 'ProXDR 2K', text: '3168 × 1440 и частота 1–120 Гц.', icon: 'tv' },
        { title: 'Hasselblad', text: 'Основная камера 50 МП на Sony LYT-808.', icon: 'camera' },
        {
          title: 'Перископ 3×',
          text: 'Телеобъектив 64 МП для дальних планов.',
          icon: 'smartphone',
        },
        { title: '5400 мА·ч', text: 'Зарядка SUPERVOOC 80 Вт и AIRVOOC 50 Вт.', icon: 'clock' },
        {
          title: 'Snapdragon 8 Gen 3',
          text: 'Флагманский процессор и графика Adreno 750.',
          icon: 'settings',
        },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '6,82″', key: true },
          { label: 'Тип экрана', value: 'ProXDR, LTPO', key: true },
          { label: 'Разрешение', value: '3168 × 1440 (QHD+), 510 ppi', key: true },
          { label: 'Частота обновления', value: '1–120 Гц', key: true },
          { label: 'Пиковая яркость', value: `4500 ${NITS}` },
          { label: 'Защитное стекло', value: 'Corning Gorilla Glass Victus 2' },
        ],
      },
      {
        title: 'Производительность',
        rows: [
          { label: 'Процессор', value: 'Snapdragon 8 Gen 3', key: true },
          { label: 'Графика', value: 'Adreno 750' },
          { label: 'Оперативная память', value: '12 ГБ LPDDR5X', key: true },
          { label: 'Встроенная память', value: '256 ГБ UFS 4.0', key: true },
        ],
      },
      {
        title: 'Камеры',
        rows: [
          { label: 'Основная камера', value: '50 МП, Sony LYT-808, ƒ/1.6', key: true },
          { label: 'Перископный телеобъектив', value: '64 МП, 3× оптический зум', key: true },
          { label: 'Сверхширокоугольная камера', value: '48 МП, 114°' },
          { label: 'Фронтальная камера', value: '32 МП, ƒ/2.4' },
          { label: 'Видео', value: '8K, 24 кадра/с' },
        ],
      },
      {
        title: 'Питание',
        rows: [
          { label: 'Аккумулятор', value: '5400 мА·ч', key: true },
          { label: 'Проводная зарядка', value: '80 Вт SUPERVOOC' },
          { label: 'Беспроводная зарядка', value: '50 Вт AIRVOOC' },
        ],
      },
      {
        title: 'Связь и интерфейсы',
        rows: [
          { label: 'Разъём', value: 'USB Type-C (USB 3.2 Gen 1)' },
          { label: 'Wi-Fi', value: 'Wi-Fi 7' },
          { label: 'Bluetooth', value: '5.4' },
          { label: 'NFC', value: 'Есть' },
        ],
      },
      {
        title: 'Корпус',
        rows: [
          { label: 'Размеры', value: '164,3 × 75,8 × 9,15 мм' },
          { label: 'Вес', value: '220 г' },
        ],
      },
      {
        title: 'Система',
        rows: [
          { label: 'Операционная система', value: 'OxygenOS 14 на базе Android 14' },
          { label: 'Сканер отпечатка пальца', value: 'В экране' },
        ],
      },
    ],
  },
  {
    slug: 'realme-gt6-256',
    category: 'smartphones',
    attributes: [
      { label: 'Цвет', value: 'Серебристый' },
      { label: 'ОЗУ', value: '12 ГБ' },
      { label: 'Память', value: '256 ГБ' },
    ],
    highlights: [
      'Snapdragon 8s Gen 3',
      'Экран 6,78″ с яркостью до 6000 кд/\u2060м²',
      'Камера 50 МП Sony LYT-808 с OIS',
      'Аккумулятор 5500 мА·ч',
      'Зарядка SUPERVOOC 120 Вт',
    ],
    description: {
      title: 'Очень яркий экран и очень быстрая зарядка',
      paragraphs: [
        'realme GT 6 построен на Snapdragon 8s Gen 3 с памятью LPDDR5X и UFS 4.0. Экран 6,78″ с разрешением 2780 × 1264 работает на частоте до 120 Гц и разгоняется до 6000 кд/\u2060м², защищён стеклом Gorilla Glass Victus 2.',
        'Основная камера 50 МП на сенсоре Sony LYT-808 со стабилизацией дополнена телеобъективом 50 МП и сверхширокоугольным модулем 8 МП. Аккумулятор 5500 мА·ч заряжается мощностью 120 Вт.',
      ],
      features: [
        { title: '6000 кд/\u2060м²', text: 'Пиковая яркость экрана 6,78″.', icon: 'tv' },
        { title: 'Sony LYT-808', text: 'Основная камера 50 МП с OIS.', icon: 'camera' },
        { title: '120 Вт', text: 'Зарядка SUPERVOOC для аккумулятора 5500 мА·ч.', icon: 'clock' },
        {
          title: 'Snapdragon 8s Gen 3',
          text: 'Производительность для игр и работы.',
          icon: 'settings',
        },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '6,78″', key: true },
          { label: 'Тип экрана', value: '8T LTPO', key: true },
          { label: 'Разрешение', value: '2780 × 1264', key: true },
          { label: 'Частота обновления', value: 'до 120 Гц', key: true },
          { label: 'Пиковая яркость', value: `6000 ${NITS}` },
          { label: 'Защитное стекло', value: 'Corning Gorilla Glass Victus 2' },
        ],
      },
      {
        title: 'Производительность',
        rows: [
          { label: 'Процессор', value: 'Snapdragon 8s Gen 3', key: true },
          { label: 'Оперативная память', value: '12 ГБ LPDDR5X', key: true },
          { label: 'Встроенная память', value: '256 ГБ UFS 4.0', key: true },
        ],
      },
      {
        title: 'Камеры',
        rows: [
          { label: 'Основная камера', value: '50 МП, Sony LYT-808, ƒ/1.69, OIS', key: true },
          { label: 'Телеобъектив', value: '50 МП, ƒ/2.0' },
          { label: 'Сверхширокоугольная камера', value: '8 МП, 112°' },
          { label: 'Фронтальная камера', value: '32 МП, ƒ/2.45' },
          { label: 'Видео', value: '4K, до 60 кадров/с' },
        ],
      },
      {
        title: 'Питание',
        rows: [
          { label: 'Аккумулятор', value: '5500 мА·ч', key: true },
          { label: 'Быстрая зарядка', value: '120 Вт SUPERVOOC' },
        ],
      },
      {
        title: 'Связь и интерфейсы',
        rows: [
          { label: 'Разъём', value: 'USB Type-C' },
          { label: 'Wi-Fi', value: 'Wi-Fi 6' },
          { label: 'Bluetooth', value: '5.4' },
          { label: 'NFC', value: 'Есть' },
        ],
      },
      {
        title: 'Корпус',
        rows: [
          { label: 'Размеры', value: '162 × 75,1 × 8,65 мм' },
          { label: 'Вес', value: 'около 199 г' },
        ],
      },
      {
        title: 'Система',
        rows: [
          { label: 'Операционная система', value: 'realme UI 5.0 на базе Android 14' },
          { label: 'Датчики', value: 'Гироскоп, акселерометр, датчики освещённости и приближения' },
        ],
      },
    ],
  },
  {
    slug: 'honor-magic6-lite-256',
    category: 'smartphones',
    attributes: [
      { label: 'Цвет', value: 'Изумрудный' },
      { label: 'Память', value: '256 ГБ' },
    ],
    highlights: [
      'Основная камера 108 МП',
      'Экран AMOLED 6,78″, 120 Гц',
      'Аккумулятор 5300 мА·ч',
      'Snapdragon 6 Gen 1',
      'Тонкий корпус 7,98 мм',
    ],
    description: {
      title: 'Большой экран и запас автономности',
      paragraphs: [
        'HONOR Magic6 Lite получил экран AMOLED 6,78″ с разрешением 2652 × 1200 и поддержкой 1,07 млрд цветов. При этом корпус остаётся тонким — 7,98 мм — и весит около 185 г.',
        'Основная камера 108 МП с диафрагмой ƒ/1.75 снимает видео в 4K, а аккумулятор ёмкостью 5300 мА·ч заряжается мощностью 35 Вт. За производительность отвечает 4-нанометровый Snapdragon 6 Gen 1.',
      ],
      features: [
        { title: 'Камера 108 МП', text: 'Детальные снимки и видео в 4K.', icon: 'camera' },
        { title: 'AMOLED 6,78″', text: 'Разрешение 2652 × 1200 и 1,07 млрд цветов.', icon: 'tv' },
        { title: '5300 мА·ч', text: 'Большой аккумулятор и зарядка 35 Вт.', icon: 'clock' },
        {
          title: 'Snapdragon 6 Gen 1',
          text: '4×A78 до 2,2 ГГц и 4×A55 до 1,8 ГГц.',
          icon: 'settings',
        },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '6,78″', key: true },
          { label: 'Тип экрана', value: 'AMOLED', key: true },
          { label: 'Разрешение', value: '2652 × 1200', key: true },
          { label: 'Частота обновления', value: 'до 120 Гц', key: true },
          { label: 'Цвета', value: '1,07 млрд' },
        ],
      },
      {
        title: 'Производительность',
        rows: [
          { label: 'Процессор', value: 'Snapdragon 6 Gen 1', key: true },
          { label: 'Частота', value: '4×A78 2,2 ГГц + 4×A55 1,8 ГГц' },
          { label: 'Оперативная память', value: '8 ГБ', key: true },
          { label: 'Встроенная память', value: '256 ГБ', key: true },
        ],
      },
      {
        title: 'Камеры',
        rows: [
          { label: 'Основная камера', value: '108 МП + 5 МП + 2 МП', key: true },
          { label: 'Основной модуль', value: '108 МП, ƒ/1.75' },
          { label: 'Фронтальная камера', value: '16 МП, ƒ/2.45' },
          { label: 'Видео', value: '4K' },
        ],
      },
      {
        title: 'Питание',
        rows: [
          { label: 'Аккумулятор', value: '5300 мА·ч (типичная ёмкость)', key: true },
          { label: 'Быстрая зарядка', value: '35 Вт' },
        ],
      },
      {
        title: 'Связь и интерфейсы',
        rows: [
          { label: 'Разъём', value: 'USB Type-C (USB 2.0)' },
          { label: 'Wi-Fi', value: '802.11 a/b/g/n/ac, 2,4 и 5 ГГц' },
          { label: 'Bluetooth', value: '5.1' },
          { label: 'Навигация', value: 'GPS, ГЛОНАСС, BeiDou, Galileo' },
        ],
      },
      {
        title: 'Корпус',
        rows: [
          { label: 'Размеры', value: '163,6 × 75,5 × 7,98 мм' },
          { label: 'Вес', value: 'около 185 г' },
        ],
      },
      {
        title: 'Система',
        rows: [
          { label: 'Операционная система', value: 'MagicOS 7.2 на базе Android 13' },
          { label: 'Разблокировка', value: 'Отпечаток пальца, распознавание лица' },
        ],
      },
    ],
  },
  {
    slug: 'nothing-phone-2a-256',
    category: 'smartphones',
    attributes: [
      { label: 'Цвет', value: 'Чёрный' },
      { label: 'Память', value: '256 ГБ' },
    ],
    highlights: [
      'Узнаваемый дизайн с Glyph Interface',
      'Две камеры по 50 МП',
      'Экран Flexible AMOLED 6,7″, 120 Гц',
      'Аккумулятор 5000 мА·ч, зарядка 45 Вт',
      'MediaTek Dimensity 7200 Pro',
    ],
    description: {
      title: 'Nothing в своём фирменном стиле',
      paragraphs: [
        'Phone (2a) сохраняет узнаваемый дизайн Nothing с подсветкой Glyph Interface. Экран Flexible AMOLED 6,7″ с адаптивной частотой 30–120 Гц и пиковой яркостью 1300 кд/\u2060м² защищён стеклом Gorilla Glass 5.',
        'Процессор MediaTek Dimensity 7200 Pro произведён по 4-нанометровому техпроцессу. Две камеры по 50 МП снимают основной и широкоугольный кадр, а аккумулятор 5000 мА·ч заряжается до 50% за 23 минуты.',
      ],
      features: [
        { title: 'Glyph Interface', text: 'Световые сигналы на задней панели.', icon: 'lightbulb' },
        { title: 'Две камеры 50 МП', text: 'Основной и широкоугольный модули.', icon: 'camera' },
        { title: 'AMOLED 120 Гц', text: 'Адаптивная частота 30–120 Гц.', icon: 'tv' },
        {
          title: 'Зарядка 45 Вт',
          text: 'До 50% за 23 минуты, полностью — за 59 минут.',
          icon: 'clock',
        },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '6,7″', key: true },
          { label: 'Тип экрана', value: 'Flexible AMOLED', key: true },
          { label: 'Разрешение', value: '2412 × 1084, 394 ppi', key: true },
          { label: 'Частота обновления', value: '30–120 Гц', key: true },
          { label: 'Пиковая яркость', value: `1300 ${NITS}` },
          { label: 'Защитное стекло', value: 'Corning Gorilla Glass 5' },
        ],
      },
      {
        title: 'Производительность',
        rows: [
          { label: 'Процессор', value: 'MediaTek Dimensity 7200 Pro', key: true },
          { label: 'Частота', value: '8 ядер, до 2,8 ГГц' },
          { label: 'Оперативная память', value: '12 ГБ', key: true },
          { label: 'Встроенная память', value: '256 ГБ', key: true },
        ],
      },
      {
        title: 'Камеры',
        rows: [
          { label: 'Основная камера', value: '50 МП + 50 МП', key: true },
          { label: 'Фронтальная камера', value: '32 МП, ƒ/2.2' },
        ],
      },
      {
        title: 'Питание',
        rows: [
          { label: 'Аккумулятор', value: '5000 мА·ч', key: true },
          { label: 'Быстрая зарядка', value: '45 Вт, до 50% за 23 мин' },
        ],
      },
      {
        title: 'Связь и интерфейсы',
        rows: [
          { label: 'Wi-Fi', value: 'Wi-Fi 6' },
          { label: 'Bluetooth', value: '5.3' },
          { label: 'NFC', value: 'Есть' },
          { label: 'SIM-карты', value: 'Две Nano-SIM' },
        ],
      },
      {
        title: 'Корпус',
        rows: [
          { label: 'Защита от воды и пыли', value: 'IP54' },
          { label: 'Размеры', value: '161,74 × 76,32 × 8,55 мм' },
          { label: 'Вес', value: '190 г' },
        ],
      },
      {
        title: 'Система',
        rows: [
          { label: 'Операционная система', value: 'Nothing OS на базе Android' },
          { label: 'Glyph Interface', value: 'Есть' },
        ],
      },
    ],
  },
  {
    slug: 'vivo-v30-256',
    category: 'smartphones',
    attributes: [
      { label: 'Цвет', value: 'Зелёный' },
      { label: 'Память', value: '256 ГБ' },
    ],
    highlights: [
      'Три камеры по 50 МП, включая фронтальную',
      'Подсветка Aura Light для портретов',
      'Экран AMOLED 6,78″ до 2800 кд/\u2060м²',
      'Snapdragon 7 Gen 3',
      'Тонкий корпус 7,45 мм',
    ],
    description: {
      title: 'Портреты с собственной подсветкой',
      paragraphs: [
        'vivo V30 получил сразу три камеры по 50 МП: основную со стабилизацией, сверхширокоугольную и фронтальную с автофокусом. Для портретов при слабом свете на задней панели есть подсветка Aura Light с двумя цветовыми температурами.',
        'Экран AMOLED 6,78″ с разрешением 2800 × 1260 выдаёт до 2800 кд/\u2060м², а корпус толщиной 7,45 мм весит 186 г. Процессор Snapdragon 7 Gen 3, аккумулятор 5000 мА·ч и зарядка 80 Вт.',
      ],
      features: [
        { title: 'Aura Light', text: 'Мягкая подсветка для портретов вечером.', icon: 'lightbulb' },
        { title: 'Селфи 50 МП', text: 'Фронтальная камера с автофокусом.', icon: 'camera' },
        { title: 'AMOLED 6,78″', text: 'Яркость до 2800 кд/\u2060м² и 452 ppi.', icon: 'tv' },
        { title: '80 Вт', text: 'Быстрая зарядка аккумулятора 5000 мА·ч.', icon: 'clock' },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '6,78″', key: true },
          { label: 'Тип экрана', value: 'AMOLED', key: true },
          { label: 'Разрешение', value: '2800 × 1260, 452 ppi', key: true },
          { label: 'Частота обновления', value: '60 / 120 Гц', key: true },
          { label: 'Пиковая яркость', value: `2800 ${NITS} (локальная)` },
        ],
      },
      {
        title: 'Производительность',
        rows: [
          { label: 'Процессор', value: 'Snapdragon 7 Gen 3', key: true },
          { label: 'Частота', value: '1 × 2,63 + 3 × 2,4 + 4 × 1,8 ГГц' },
          { label: 'Оперативная память', value: '12 ГБ', key: true },
          { label: 'Встроенная память', value: '256 ГБ', key: true },
        ],
      },
      {
        title: 'Камеры',
        rows: [
          { label: 'Основная камера', value: '50 МП + 50 МП', key: true },
          { label: 'Основной модуль', value: '50 МП, ƒ/1.88, OIS' },
          { label: 'Фронтальная камера', value: '50 МП, ƒ/2.0, автофокус' },
          { label: 'Подсветка', value: 'Aura Light' },
          { label: 'Видео', value: '4K' },
        ],
      },
      {
        title: 'Питание',
        rows: [
          { label: 'Аккумулятор', value: '5000 мА·ч', key: true },
          { label: 'Быстрая зарядка', value: '80 Вт' },
        ],
      },
      {
        title: 'Связь и интерфейсы',
        rows: [
          { label: 'Разъём', value: 'USB Type-C (USB 2.0)' },
          { label: 'Wi-Fi', value: '2,4 и 5 ГГц' },
          { label: 'Bluetooth', value: '5.4' },
          { label: 'NFC', value: 'Есть' },
        ],
      },
      {
        title: 'Корпус',
        rows: [
          { label: 'Защита от воды и пыли', value: 'IP54' },
          { label: 'Размеры', value: '164,36 × 75,1 × 7,45 мм' },
          { label: 'Вес', value: '186 г' },
        ],
      },
      {
        title: 'Система',
        rows: [
          { label: 'Операционная система', value: 'Funtouch OS 14 на базе Android 14' },
          { label: 'Сканер отпечатка пальца', value: 'Оптический, в экране' },
        ],
      },
    ],
  },
  {
    slug: 'oppo-reno-11-256',
    category: 'smartphones',
    attributes: [
      { label: 'Цвет', value: 'Зелёный' },
      { label: 'Память', value: '256 ГБ' },
    ],
    highlights: [
      'Телеобъектив 32 МП для портретов',
      'Основная камера 50 МП со стабилизацией',
      'Изогнутый OLED-экран 6,7″, 120 Гц',
      'Зарядка SUPERVOOC 67 Вт',
      'MediaTek Dimensity 7050',
    ],
    description: {
      title: 'Портретная камера в изящном корпусе',
      paragraphs: [
        'OPPO Reno11 5G рассчитан на портреты: к основной камере 50 МП со стабилизацией добавлен телеобъектив 32 МП с автофокусом и сверхширокоугольный модуль 8 МП. Фронтальная камера 32 МП снимает видео в 4K.',
        'Изогнутый OLED-экран 6,7″ с частотой до 120 Гц занимает 93% передней панели. Внутри — MediaTek Dimensity 7050 и аккумулятор 5000 мА·ч с зарядкой SUPERVOOC 67 Вт.',
      ],
      features: [
        {
          title: 'Телеобъектив 32 МП',
          text: 'Портреты с автофокусом и естественной перспективой.',
          icon: 'camera',
        },
        { title: 'OLED 120 Гц', text: 'Изогнутый экран 6,7″ с охватом DCI-P3.', icon: 'tv' },
        {
          title: 'SUPERVOOC 67 Вт',
          text: 'Быстрая зарядка аккумулятора 5000 мА·ч.',
          icon: 'clock',
        },
        {
          title: 'Dimensity 7050',
          text: '8-ядерный процессор с графикой Mali-G68.',
          icon: 'settings',
        },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '6,7″', key: true },
          { label: 'Тип экрана', value: '3D-гибкий OLED', key: true },
          { label: 'Разрешение', value: '2412 × 1080, 394 ppi', key: true },
          { label: 'Частота обновления', value: 'до 120 Гц', key: true },
          { label: 'Яркость', value: `800 ${NITS} (HBM)` },
        ],
      },
      {
        title: 'Производительность',
        rows: [
          { label: 'Процессор', value: 'MediaTek Dimensity 7050', key: true },
          { label: 'Графика', value: 'Mali-G68 MC4' },
          { label: 'Встроенная память', value: '256 ГБ', key: true },
        ],
      },
      {
        title: 'Камеры',
        rows: [
          { label: 'Основная камера', value: '50 МП, ƒ/1.8, OIS', key: true },
          { label: 'Телеобъектив', value: '32 МП, ƒ/2.0' },
          { label: 'Сверхширокоугольная камера', value: '8 МП, 112°' },
          { label: 'Фронтальная камера', value: '32 МП, ƒ/2.4' },
          { label: 'Видео', value: '4K, 30 кадров/с' },
        ],
      },
      {
        title: 'Питание',
        rows: [
          { label: 'Аккумулятор', value: '5000 мА·ч (типичная ёмкость)', key: true },
          { label: 'Быстрая зарядка', value: 'SUPERVOOC 67 Вт' },
        ],
      },
      {
        title: 'Связь и интерфейсы',
        rows: [
          { label: 'Разъём', value: 'USB Type-C' },
          { label: 'Wi-Fi', value: 'Wi-Fi 6 (802.11ax)' },
          { label: 'Bluetooth', value: '5.3' },
          { label: 'NFC', value: 'Есть' },
        ],
      },
      {
        title: 'Корпус',
        rows: [
          { label: 'Размеры', value: '162,4 × 74,3 × 8,04 мм' },
          { label: 'Вес', value: 'около 182 г' },
        ],
      },
      {
        title: 'Система',
        rows: [
          { label: 'Операционная система', value: 'ColorOS 14' },
          { label: 'Биометрия', value: 'Отпечаток пальца, распознавание лица' },
        ],
      },
    ],
  },
  {
    slug: 'infinix-zero-30-256',
    category: 'smartphones',
    attributes: [
      { label: 'Цвет', value: 'Золотой' },
      { label: 'Память', value: '256 ГБ' },
    ],
    highlights: [
      'Фронтальная камера 50 МП с видео 4K 60 кадров/с',
      'Основная камера 108 МП со стабилизацией',
      'Изогнутый AMOLED-экран 144 Гц',
      'Зарядка 68 Вт',
      'MediaTek Dimensity 8020',
    ],
    description: {
      title: 'Смартфон для видеоблогов',
      paragraphs: [
        'Главная особенность Infinix ZERO 30 5G — фронтальная камера 50 МП с автофокусом, которая снимает видео в 4K с частотой 60 кадров/с. Основная камера 108 МП с оптической стабилизацией дополнена сверхширокоугольным модулем.',
        'Изогнутый AMOLED-экран 6,78″ работает на частоте 144 Гц, а стекло Corning Gorilla Glass защищает обе стороны корпуса толщиной 7,9 мм. Процессор MediaTek Dimensity 8020 и аккумулятор 5000 мА·ч с зарядкой 68 Вт.',
      ],
      features: [
        { title: 'Селфи 4K 60', text: 'Фронтальная камера 50 МП с автофокусом.', icon: 'camera' },
        {
          title: '108 МП',
          text: 'Основная камера с оптической стабилизацией.',
          icon: 'smartphone',
        },
        { title: 'AMOLED 144 Гц', text: 'Изогнутый экран 6,78″ и 10-битный цвет.', icon: 'tv' },
        { title: '68 Вт', text: 'Быстрая зарядка аккумулятора 5000 мА·ч.', icon: 'clock' },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '6,78″', key: true },
          { label: 'Тип экрана', value: 'AMOLED, изогнутый', key: true },
          { label: 'Разрешение', value: '2400 × 1080 (FHD+)', key: true },
          { label: 'Частота обновления', value: '144 Гц', key: true },
          { label: 'Пиковая яркость', value: `950 ${NITS}` },
          { label: 'Защитное стекло', value: 'Corning Gorilla Glass' },
        ],
      },
      {
        title: 'Производительность',
        rows: [
          { label: 'Процессор', value: 'MediaTek Dimensity 8020', key: true },
          { label: 'Встроенная память', value: '256 ГБ UFS 3.1', key: true },
        ],
      },
      {
        title: 'Камеры',
        rows: [
          { label: 'Основная камера', value: '108 МП, OIS', key: true },
          { label: 'Сверхширокоугольная камера', value: '120°' },
          { label: 'Фронтальная камера', value: '50 МП, автофокус', key: true },
          { label: 'Видео с фронтальной камеры', value: '4K, 60 кадров/с' },
        ],
      },
      {
        title: 'Питание',
        rows: [
          { label: 'Аккумулятор', value: '5000 мА·ч', key: true },
          { label: 'Быстрая зарядка', value: '68 Вт' },
        ],
      },
      {
        title: 'Связь и интерфейсы',
        rows: [
          { label: 'Разъём', value: 'USB Type-C, OTG' },
          { label: 'Wi-Fi', value: 'Wi-Fi 6' },
          { label: 'NFC', value: 'Есть' },
          { label: 'SIM-карты', value: 'Две Nano-SIM' },
        ],
      },
      {
        title: 'Корпус',
        rows: [
          { label: 'Размеры', value: '164,51 × 75,03 × 7,9 мм' },
          { label: 'Вес', value: '185 г' },
        ],
      },
      {
        title: 'Система',
        rows: [
          { label: 'Операционная система', value: 'Android 13' },
          { label: 'Сканер отпечатка пальца', value: 'Есть' },
        ],
      },
    ],
  },
  {
    slug: 'tecno-camon-30-256',
    category: 'smartphones',
    attributes: [
      { label: 'Цвет', value: 'Чёрный' },
      { label: 'Память', value: '256 ГБ' },
    ],
    highlights: [
      'Основная камера 50 МП со стабилизацией',
      'Фронтальная камера 50 МП с автофокусом',
      'Экран AMOLED 6,78″, 120 Гц',
      'Зарядка 70 Вт',
      'Стереодинамики с Dolby Atmos',
    ],
    description: {
      title: 'Две камеры по 50 МП для ярких историй',
      paragraphs: [
        'TECNO CAMON 30 оснащён основной камерой 50 МП с крупным сенсором 1/1,57″ и оптической стабилизацией, а для селфи — фронтальной камерой 50 МП с автофокусом и двухцветной вспышкой.',
        'Экран AMOLED 6,78″ с разрешением FHD+ работает на 120 Гц, стереодинамики поддерживают Dolby Atmos. Процессор Helio G99 Ultimate и аккумулятор 5000 мА·ч с зарядкой 70 Вт.',
      ],
      features: [
        {
          title: 'Камера 50 МП',
          text: 'Сенсор 1/1,57″ и оптическая стабилизация.',
          icon: 'camera',
        },
        { title: 'Селфи 50 МП', text: 'Автофокус и фронтальная вспышка.', icon: 'smartphone' },
        { title: 'AMOLED 120 Гц', text: 'Экран 6,78″ с разрешением FHD+.', icon: 'tv' },
        { title: '70 Вт', text: 'Быстрая зарядка аккумулятора 5000 мА·ч.', icon: 'clock' },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '6,78″', key: true },
          { label: 'Тип экрана', value: 'AMOLED', key: true },
          { label: 'Разрешение', value: '2436 × 1080 (FHD+)', key: true },
          { label: 'Частота обновления', value: '120 Гц', key: true },
        ],
      },
      {
        title: 'Производительность',
        rows: [
          { label: 'Процессор', value: 'MediaTek Helio G99 Ultimate', key: true },
          { label: 'Встроенная память', value: '256 ГБ', key: true },
        ],
      },
      {
        title: 'Камеры',
        rows: [
          { label: 'Основная камера', value: '50 МП, OIS + 2 МП', key: true },
          { label: 'Сенсор основной камеры', value: '1/1,57″' },
          { label: 'Фронтальная камера', value: '50 МП, автофокус' },
          { label: 'Вспышка', value: 'Двойная основная, двухцветная фронтальная' },
        ],
      },
      {
        title: 'Питание',
        rows: [
          { label: 'Аккумулятор', value: '5000 мА·ч', key: true },
          { label: 'Быстрая зарядка', value: '70 Вт' },
        ],
      },
      {
        title: 'Связь и интерфейсы',
        rows: [
          { label: 'Разъём', value: 'USB Type-C, OTG' },
          { label: 'NFC', value: 'Есть' },
          { label: 'ИК-порт', value: 'Есть' },
          { label: 'Звук', value: 'Стереодинамики, Dolby Atmos' },
        ],
      },
      {
        title: 'Корпус',
        rows: [
          { label: 'Размеры', value: '165,27 × 75,33 × 7,7–7,82 мм' },
          { label: 'Задняя панель', value: 'Стекло или экокожа, зависит от цвета' },
        ],
      },
      {
        title: 'Система',
        rows: [
          { label: 'Операционная система', value: 'Android 14' },
          { label: 'Сканер отпечатка пальца', value: 'Есть' },
        ],
      },
    ],
  },
];
