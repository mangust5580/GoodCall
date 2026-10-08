import type { ProductDetailsContent } from '../productDetailsContent.types';

const NITS = 'кд/\u2060м²';

export const LAPTOPS_CONTENT: readonly ProductDetailsContent[] = [
  {
    slug: 'macbook-air-13-m3-256',
    category: 'laptops',
    attributes: [
      { label: 'Цвет', value: 'Полночь' },
      { label: 'ОЗУ', value: '8 ГБ' },
      { label: 'SSD', value: '256 ГБ' },
    ],
    highlights: [
      'Чип Apple M3 с 8-ядерным CPU',
      'Дисплей Liquid Retina 13,6″',
      'До 18 часов воспроизведения видео',
      'Бесшумная конструкция без вентилятора',
      'Вес 1,24 кг',
    ],
    description: {
      title: 'Тонкий и тихий ноутбук на чипе M3',
      paragraphs: [
        'MacBook Air 13 работает на чипе Apple M3 с 8-ядерным процессором и 8-ядерной графикой с аппаратной трассировкой лучей. Ноутбук обходится без вентилятора, поэтому остаётся бесшумным даже под нагрузкой.',
        `Дисплей Liquid Retina 13,6″ с разрешением 2560 × 1664 и яркостью 500 ${NITS} подходит для работы и фильмов. Корпус толщиной 1,13 см весит 1,24 кг, а батареи хватает до 18 часов воспроизведения видео.`,
      ],
      features: [
        { title: 'Apple M3', text: '8-ядерный CPU и 16-ядерный Neural Engine.', icon: 'settings' },
        { title: 'Liquid Retina 13,6″', text: `2560 × 1664 и яркость 500 ${NITS}.`, icon: 'tv' },
        {
          title: 'До 18 часов',
          text: 'Воспроизведения видео в приложении Apple TV.',
          icon: 'clock',
        },
        {
          title: 'Без вентилятора',
          text: 'Пассивное охлаждение и тишина в работе.',
          icon: 'laptop',
        },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '13,6″', key: true },
          { label: 'Разрешение', value: '2560 × 1664, 224 ppi', key: true },
          { label: 'Тип экрана', value: 'Liquid Retina, IPS' },
          { label: 'Яркость', value: `500 ${NITS}` },
        ],
      },
      {
        title: 'Процессор',
        rows: [
          { label: 'Процессор', value: 'Apple M3', key: true },
          { label: 'Ядра CPU', value: '8 (4 производительных и 4 энергоэффективных)' },
          { label: 'Neural Engine', value: '16-ядерный' },
        ],
      },
      {
        title: 'Память и накопитель',
        rows: [
          { label: 'Оперативная память', value: '8 ГБ', key: true },
          { label: 'Тип памяти', value: 'Объединённая' },
          { label: 'Накопитель', value: '256 ГБ SSD', key: true },
        ],
      },
      {
        title: 'Графика',
        rows: [
          { label: 'Видеокарта', value: 'Встроенная', key: true },
          { label: 'Графический процессор', value: '8-ядерный GPU Apple M3' },
          { label: 'Трассировка лучей', value: 'Аппаратная' },
        ],
      },
      {
        title: 'Корпус и порты',
        rows: [
          { label: 'Цвет', value: 'Полночь' },
          { label: 'Вес', value: '1,24 кг', key: true },
          { label: 'Размеры', value: '30,41 × 21,5 × 1,13 см' },
          { label: 'Порты', value: 'MagSafe 3, 2 × Thunderbolt / USB 4, разъём 3,5 мм' },
          { label: 'Беспроводная связь', value: 'Wi-Fi 6E, Bluetooth 5.3' },
        ],
      },
      {
        title: 'Система и батарея',
        rows: [
          { label: 'Операционная система', value: 'macOS', key: true },
          { label: 'Батарея', value: '52,6 Вт·ч' },
          { label: 'Время работы', value: 'до 18 ч воспроизведения видео' },
          { label: 'Камера', value: 'FaceTime HD 1080p' },
        ],
      },
    ],
  },
  {
    slug: 'macbook-pro-14-m3-512',
    category: 'laptops',
    attributes: [
      { label: 'Цвет', value: 'Серый космос' },
      { label: 'ОЗУ', value: '8 ГБ' },
      { label: 'SSD', value: '512 ГБ' },
    ],
    highlights: [
      'Чип Apple M3 с 10-ядерной графикой',
      'Дисплей Liquid Retina XDR 14,2″',
      'ProMotion до 120 Гц',
      'До 22 часов воспроизведения видео',
      'HDMI и слот SDXC',
    ],
    description: {
      title: 'Профессиональный экран и чип M3',
      paragraphs: [
        'MacBook Pro 14 построен на чипе Apple M3 с 8-ядерным процессором и 10-ядерной графикой. Активное охлаждение поддерживает высокую производительность в долгих задачах: монтаже, сборке проектов и работе с фото.',
        `Дисплей Liquid Retina XDR 14,2″ с ProMotion до 120 Гц выдаёт до 1000 ${NITS} в длительном режиме и до 1600 ${NITS} в HDR. Рядом с Thunderbolt есть HDMI, слот SDXC и MagSafe 3, а батареи хватает до 22 часов видео.`,
      ],
      features: [
        { title: 'Apple M3', text: '8-ядерный CPU и 10-ядерный GPU.', icon: 'settings' },
        { title: 'Liquid Retina XDR', text: '3024 × 1964 и ProMotion до 120 Гц.', icon: 'tv' },
        {
          title: 'До 22 часов',
          text: 'Воспроизведения видео в приложении Apple TV.',
          icon: 'clock',
        },
        {
          title: 'Порты для работы',
          text: 'HDMI, SDXC, MagSafe 3 и два Thunderbolt.',
          icon: 'link',
        },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '14,2″', key: true },
          { label: 'Разрешение', value: '3024 × 1964, 254 ppi', key: true },
          { label: 'Тип экрана', value: 'Liquid Retina XDR' },
          { label: 'Частота обновления', value: 'ProMotion до 120 Гц' },
          { label: 'Яркость', value: `до 1000 ${NITS} длительно, до 1600 ${NITS} в HDR` },
        ],
      },
      {
        title: 'Процессор',
        rows: [
          { label: 'Процессор', value: 'Apple M3', key: true },
          { label: 'Ядра CPU', value: '8 (4 производительных и 4 энергоэффективных)' },
          { label: 'Neural Engine', value: '16-ядерный' },
        ],
      },
      {
        title: 'Память и накопитель',
        rows: [
          { label: 'Оперативная память', value: '8 ГБ', key: true },
          { label: 'Тип памяти', value: 'Объединённая' },
          { label: 'Накопитель', value: '512 ГБ SSD', key: true },
        ],
      },
      {
        title: 'Графика',
        rows: [
          { label: 'Видеокарта', value: 'Встроенная', key: true },
          { label: 'Графический процессор', value: '10-ядерный GPU Apple M3' },
          { label: 'Трассировка лучей', value: 'Аппаратная' },
        ],
      },
      {
        title: 'Корпус и порты',
        rows: [
          { label: 'Цвет', value: 'Серый космос' },
          { label: 'Вес', value: '1,55 кг', key: true },
          { label: 'Размеры', value: '31,26 × 22,12 × 1,55 см' },
          {
            label: 'Порты',
            value: 'MagSafe 3, 2 × Thunderbolt / USB 4, HDMI, SDXC, разъём 3,5 мм',
          },
          { label: 'Беспроводная связь', value: 'Wi-Fi 6E, Bluetooth 5.3' },
        ],
      },
      {
        title: 'Система и батарея',
        rows: [
          { label: 'Операционная система', value: 'macOS', key: true },
          { label: 'Батарея', value: '69,6 Вт·ч' },
          { label: 'Время работы', value: 'до 22 ч воспроизведения видео' },
          { label: 'Адаптер питания', value: 'USB-C 70 Вт' },
        ],
      },
    ],
  },
  {
    slug: 'asus-vivobook-15-i5-512',
    category: 'laptops',
    attributes: [
      { label: 'Цвет', value: 'Серебристый' },
      { label: 'ОЗУ', value: '16 ГБ' },
      { label: 'SSD', value: '512 ГБ' },
    ],
    highlights: [
      'Процессор Intel Core i5-1335U',
      '16 ГБ оперативной памяти',
      'Экран Full HD 15,6″',
      'Шторка веб-камеры',
      'Батарея 42 Вт·ч',
    ],
    description: {
      title: 'Универсальный ноутбук на каждый день',
      paragraphs: [
        'ASUS Vivobook 15 рассчитан на учёбу, офисные задачи и видео. Процессор Intel Core i5-1335U с 10 ядрами и 16 ГБ оперативной памяти спокойно держат браузер с десятками вкладок, документы и видеозвонки одновременно.',
        'Экран 15,6″ Full HD с антибликовым покрытием удобен при дневном свете. Веб-камера 720p закрывается физической шторкой, а корпус весит 1,7 кг, поэтому ноутбук удобно брать на занятия.',
      ],
      features: [
        { title: 'Intel Core i5', text: '10 ядер и 12 потоков, до 4,6 ГГц.', icon: 'settings' },
        { title: 'Full HD 15,6″', text: 'Антибликовое покрытие экрана.', icon: 'tv' },
        { title: '512 ГБ SSD', text: 'Быстрый накопитель M.2 NVMe.', icon: 'folder' },
        { title: 'Шторка камеры', text: 'Физическая защита приватности.', icon: 'camera' },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '15,6″', key: true },
          { label: 'Разрешение', value: '1920 × 1080 (Full HD)', key: true },
          { label: 'Покрытие', value: 'Антибликовое' },
        ],
      },
      {
        title: 'Процессор',
        rows: [
          { label: 'Процессор', value: 'Intel Core i5-1335U', key: true },
          { label: 'Ядра и потоки', value: '10 ядер, 12 потоков' },
          { label: 'Частота', value: 'до 4,6 ГГц' },
        ],
      },
      {
        title: 'Память и накопитель',
        rows: [
          { label: 'Оперативная память', value: '16 ГБ', key: true },
          { label: 'Накопитель', value: '512 ГБ SSD', key: true },
          { label: 'Интерфейс накопителя', value: 'M.2 NVMe PCIe 4.0' },
        ],
      },
      {
        title: 'Графика',
        rows: [
          { label: 'Видеокарта', value: 'Встроенная', key: true },
          { label: 'Графический процессор', value: 'Intel Iris Xe Graphics' },
        ],
      },
      {
        title: 'Корпус и порты',
        rows: [
          { label: 'Цвет', value: 'Серебристый' },
          { label: 'Вес', value: '1,7 кг' },
          { label: 'Веб-камера', value: '720p HD со шторкой' },
        ],
      },
      {
        title: 'Система и батарея',
        rows: [
          { label: 'Операционная система', value: 'Windows 11 Home', key: true },
          { label: 'Батарея', value: '42 Вт·ч' },
        ],
      },
    ],
  },
  {
    slug: 'asus-tuf-f15-rtx3050',
    category: 'laptops',
    attributes: [
      { label: 'Цвет', value: 'Серый' },
      { label: 'ОЗУ', value: '16 ГБ' },
      { label: 'SSD', value: '512 ГБ' },
    ],
    highlights: [
      'Видеокарта NVIDIA GeForce RTX 3050',
      'Экран 15,6″ с частотой 144 Гц',
      'Процессор Intel Core i5-12500H',
      'Thunderbolt 4 и RJ-45',
      'Защищённость по MIL-STD-810H',
    ],
    description: {
      title: 'Игровой ноутбук с запасом прочности',
      paragraphs: [
        'ASUS TUF Gaming F15 сочетает процессор Intel Core i5-12500H с 12 ядрами и видеокарту NVIDIA GeForce RTX 3050. Этого достаточно для популярных сетевых игр в Full HD и для работы с графикой и видео.',
        'Экран 15,6″ с частотой 144 Гц делает картинку в динамичных играх плавной. Корпус проходит испытания по стандарту MIL-STD-810H, а среди разъёмов есть Thunderbolt 4, HDMI 2.0b и проводная сеть RJ-45.',
      ],
      features: [
        { title: 'RTX 3050', text: 'Дискретная графика с 4 ГБ GDDR6.', icon: 'gamepad' },
        { title: '144 Гц', text: 'Плавная картинка на экране 15,6″.', icon: 'tv' },
        { title: 'Core i5-12500H', text: '12 ядер и 16 потоков, до 4,5 ГГц.', icon: 'settings' },
        { title: 'MIL-STD-810H', text: 'Испытания корпуса на прочность.', icon: 'shield' },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '15,6″', key: true },
          { label: 'Разрешение', value: '1920 × 1080 (Full HD)', key: true },
          { label: 'Частота обновления', value: '144 Гц' },
          { label: 'Тип матрицы', value: 'IPS-уровня, антибликовое покрытие' },
        ],
      },
      {
        title: 'Процессор',
        rows: [
          { label: 'Процессор', value: 'Intel Core i5-12500H', key: true },
          { label: 'Ядра и потоки', value: '12 ядер, 16 потоков' },
          { label: 'Частота', value: 'до 4,5 ГГц' },
        ],
      },
      {
        title: 'Память и накопитель',
        rows: [
          { label: 'Оперативная память', value: '16 ГБ', key: true },
          { label: 'Тип памяти', value: 'DDR4-3200' },
          { label: 'Накопитель', value: '512 ГБ SSD', key: true },
        ],
      },
      {
        title: 'Графика',
        rows: [
          { label: 'Видеокарта', value: 'NVIDIA GeForce RTX 3050', key: true },
          { label: 'Видеопамять', value: '4 ГБ GDDR6' },
        ],
      },
      {
        title: 'Корпус и порты',
        rows: [
          { label: 'Цвет', value: 'Серый' },
          { label: 'Вес', value: '2,2 кг' },
          {
            label: 'Порты',
            value:
              'Thunderbolt 4, USB-C 3.2 Gen 2, 2 × USB-A 3.2 Gen 1, HDMI 2.0b, RJ-45, разъём 3,5 мм',
          },
          { label: 'Прочность', value: 'MIL-STD-810H' },
        ],
      },
      {
        title: 'Система и батарея',
        rows: [
          { label: 'Операционная система', value: 'Windows 11 Home', key: true },
          { label: 'Батарея', value: '56 Вт·ч' },
        ],
      },
    ],
  },
  {
    slug: 'lenovo-ideapad-slim-5-14',
    category: 'laptops',
    attributes: [
      { label: 'Цвет', value: 'Серый' },
      { label: 'ОЗУ', value: '16 ГБ' },
      { label: 'SSD', value: '512 ГБ' },
    ],
    highlights: [
      'Процессор AMD Ryzen 7 7730U',
      'Экран 14″ формата 16:10',
      '16 ГБ оперативной памяти',
      'Два порта USB-C с зарядкой',
      'Вес от 1,46 кг',
    ],
    description: {
      title: 'Компактный ноутбук с восемью ядрами',
      paragraphs: [
        'Lenovo IdeaPad Slim 5 14 работает на AMD Ryzen 7 7730U с 8 ядрами и 16 потоками. Вместе с 16 ГБ памяти и SSD на 512 ГБ этого хватает для учёбы, офисной работы, фоторедакторов и многозадачности.',
        'Экран 14″ с разрешением 1920 × 1200 и форматом 16:10 показывает больше строк текста, чем привычный 16:9. Ноутбук весит от 1,46 кг и заряжается через любой из двух портов USB-C.',
      ],
      features: [
        { title: 'Ryzen 7 7730U', text: '8 ядер и 16 потоков, до 4,5 ГГц.', icon: 'settings' },
        { title: 'Экран 16:10', text: '1920 × 1200 на диагонали 14″.', icon: 'tv' },
        { title: 'USB-C', text: 'Зарядка и вывод изображения.', icon: 'link' },
        { title: 'От 1,46 кг', text: 'Удобно брать с собой.', icon: 'briefcase' },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '14″', key: true },
          { label: 'Разрешение', value: '1920 × 1200 (WUXGA)', key: true },
          { label: 'Тип матрицы', value: `IPS, 300 ${NITS}` },
          { label: 'Соотношение сторон', value: '16:10' },
        ],
      },
      {
        title: 'Процессор',
        rows: [
          { label: 'Процессор', value: 'AMD Ryzen 7 7730U', key: true },
          { label: 'Ядра и потоки', value: '8 ядер, 16 потоков' },
          { label: 'Частота', value: 'до 4,5 ГГц' },
        ],
      },
      {
        title: 'Память и накопитель',
        rows: [
          { label: 'Оперативная память', value: '16 ГБ', key: true },
          { label: 'Тип памяти', value: 'Распаянная' },
          { label: 'Накопитель', value: '512 ГБ SSD', key: true },
        ],
      },
      {
        title: 'Графика',
        rows: [
          { label: 'Видеокарта', value: 'Встроенная', key: true },
          { label: 'Графический процессор', value: 'AMD Radeon Graphics' },
        ],
      },
      {
        title: 'Корпус и порты',
        rows: [
          { label: 'Цвет', value: 'Серый' },
          { label: 'Вес', value: 'от 1,46 кг' },
          {
            label: 'Порты',
            value: '2 × USB-C 3.2 Gen 1, 2 × USB-A 3.2 Gen 1, HDMI 1.4b, microSD, разъём 3,5 мм',
          },
        ],
      },
      {
        title: 'Система и батарея',
        rows: [
          { label: 'Операционная система', value: 'Windows 11 Home', key: true },
          { label: 'Быстрая зарядка', value: 'Rapid Charge Boost' },
        ],
      },
    ],
  },
  {
    slug: 'lenovo-legion-5-16-rtx4060',
    category: 'laptops',
    attributes: [
      { label: 'Цвет', value: 'Серый' },
      { label: 'ОЗУ', value: '16 ГБ' },
      { label: 'SSD', value: '1 ТБ' },
    ],
    highlights: [
      'Видеокарта NVIDIA GeForce RTX 4060',
      'Процессор AMD Ryzen 7 7840HS',
      'Экран 16″ 2560 × 1600, 165 Гц',
      'SSD на 1 ТБ',
      'Батарея 80 Вт·ч',
    ],
    description: {
      title: 'Тонкий игровой ноутбук на RTX 4060',
      paragraphs: [
        'Lenovo Legion Slim 5 16 объединяет AMD Ryzen 7 7840HS с 8 ядрами и видеокарту NVIDIA GeForce RTX 4060 с 8 ГБ GDDR6. Связка рассчитана на современные игры с высокими настройками и на работу с 3D и видео.',
        'Экран 16″ с разрешением 2560 × 1600 и частотой 165 Гц даёт чёткую и плавную картинку. Память DDR5-5600, SSD на 1 ТБ и батарея 80 Вт·ч с быстрой зарядкой дополняют конфигурацию.',
      ],
      features: [
        { title: 'RTX 4060', text: '8 ГБ GDDR6 и поддержка DLSS 3.', icon: 'gamepad' },
        { title: 'Ryzen 7 7840HS', text: '8 ядер и 16 потоков, до 5,1 ГГц.', icon: 'settings' },
        { title: '165 Гц', text: 'Экран 16″ с разрешением 2560 × 1600.', icon: 'tv' },
        { title: '1 ТБ SSD', text: 'Место для большой библиотеки игр.', icon: 'folder' },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '16″', key: true },
          { label: 'Разрешение', value: '2560 × 1600 (WQXGA)', key: true },
          { label: 'Частота обновления', value: '165 Гц' },
          { label: 'Тип матрицы', value: 'IPS' },
        ],
      },
      {
        title: 'Процессор',
        rows: [
          { label: 'Процессор', value: 'AMD Ryzen 7 7840HS', key: true },
          { label: 'Ядра и потоки', value: '8 ядер, 16 потоков' },
          { label: 'Частота', value: 'до 5,1 ГГц' },
        ],
      },
      {
        title: 'Память и накопитель',
        rows: [
          { label: 'Оперативная память', value: '16 ГБ', key: true },
          { label: 'Тип памяти', value: 'DDR5-5600' },
          { label: 'Накопитель', value: '1 ТБ SSD', key: true },
        ],
      },
      {
        title: 'Графика',
        rows: [
          { label: 'Видеокарта', value: 'NVIDIA GeForce RTX 4060', key: true },
          { label: 'Видеопамять', value: '8 ГБ GDDR6' },
        ],
      },
      {
        title: 'Корпус и порты',
        rows: [
          { label: 'Цвет', value: 'Серый' },
          { label: 'Вес', value: 'менее 2,4 кг' },
          {
            label: 'Порты',
            value:
              '2 × USB-C 3.2 Gen 2, 2 × USB-A 3.2 Gen 2, HDMI 2.1, RJ-45, кардридер, разъём 3,5 мм',
          },
        ],
      },
      {
        title: 'Система и батарея',
        rows: [
          { label: 'Операционная система', value: 'Windows 11', key: true },
          { label: 'Батарея', value: '80 Вт·ч' },
          { label: 'Модель', value: 'Legion Slim 5 16APH8' },
        ],
      },
    ],
  },
  {
    slug: 'hp-15-i5-512',
    category: 'laptops',
    attributes: [
      { label: 'Цвет', value: 'Серебристый' },
      { label: 'ОЗУ', value: '8 ГБ' },
      { label: 'SSD', value: '512 ГБ' },
    ],
    highlights: [
      'Процессор Intel Core i5-1335U',
      'Экран Full HD 15,6″',
      'SSD на 512 ГБ',
      'Порты USB-C, USB-A и HDMI',
    ],
    description: {
      title: 'Простой ноутбук для учёбы и дома',
      paragraphs: [
        'HP 15 — понятный ноутбук для учёбы, документов, интернета и видео. Процессор Intel Core i5-1335U с 10 ядрами быстро открывает приложения, а SSD на 512 ГБ вмещает рабочие файлы, фото и учебные материалы.',
        'Экран 15,6″ Full HD с тонкими рамками и антибликовым покрытием удобен для долгой работы. Для периферии есть USB-C, два USB-A и HDMI, чтобы подключить монитор, мышь или флешку без переходников.',
      ],
      features: [
        { title: 'Intel Core i5', text: '10 ядер и 12 потоков, до 4,6 ГГц.', icon: 'settings' },
        { title: 'Full HD 15,6″', text: 'Тонкие рамки и антибликовое покрытие.', icon: 'tv' },
        { title: '512 ГБ SSD', text: 'Место для документов и медиатеки.', icon: 'folder' },
        { title: 'Нужные порты', text: 'USB-C, два USB-A и HDMI.', icon: 'link' },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '15,6″', key: true },
          { label: 'Разрешение', value: '1920 × 1080 (Full HD)', key: true },
          { label: 'Покрытие', value: 'Антибликовое' },
        ],
      },
      {
        title: 'Процессор',
        rows: [
          { label: 'Процессор', value: 'Intel Core i5-1335U', key: true },
          { label: 'Ядра и потоки', value: '10 ядер, 12 потоков' },
          { label: 'Частота', value: 'до 4,6 ГГц' },
        ],
      },
      {
        title: 'Память и накопитель',
        rows: [
          { label: 'Оперативная память', value: '8 ГБ', key: true },
          { label: 'Накопитель', value: '512 ГБ SSD', key: true },
        ],
      },
      {
        title: 'Графика',
        rows: [
          { label: 'Видеокарта', value: 'Встроенная', key: true },
          { label: 'Графический процессор', value: 'Встроенная графика Intel' },
        ],
      },
      {
        title: 'Корпус и порты',
        rows: [
          { label: 'Цвет', value: 'Серебристый' },
          { label: 'Вес', value: 'около 1,6 кг' },
          { label: 'Порты', value: 'USB-C 5 Гбит/с, 2 × USB-A 5 Гбит/с, HDMI 1.4b, разъём 3,5 мм' },
          { label: 'Модель', value: 'HP Laptop 15-fd0000' },
        ],
      },
      {
        title: 'Система и батарея',
        rows: [
          { label: 'Операционная система', value: 'Windows 11 Home', key: true },
          { label: 'Батарея', value: '41 Вт·ч' },
        ],
      },
    ],
  },
  {
    slug: 'hp-victus-16-rtx4050',
    category: 'laptops',
    attributes: [
      { label: 'Цвет', value: 'Синий' },
      { label: 'ОЗУ', value: '16 ГБ' },
      { label: 'SSD', value: '512 ГБ' },
    ],
    highlights: [
      'Видеокарта NVIDIA GeForce RTX 4050',
      'Процессор AMD Ryzen 5 7640HS',
      'Экран 16,1″ с частотой 144 Гц',
      'HDMI 2.1 и RJ-45',
      'Батарея 70 Вт·ч',
    ],
    description: {
      title: 'Игровой ноутбук с большим экраном',
      paragraphs: [
        'HP Victus 16 оснащён процессором AMD Ryzen 5 7640HS с 6 ядрами и видеокартой NVIDIA GeForce RTX 4050 с 6 ГБ GDDR6. Он подходит для игр в Full HD, стриминга и монтажа роликов для соцсетей.',
        'Экран 16,1″ с частотой 144 Гц показывает плавную картинку в динамичных сценах. 16 ГБ памяти, SSD на 512 ГБ и батарея 70 Вт·ч дополняют конфигурацию, а для монитора и сети есть HDMI 2.1 и RJ-45.',
      ],
      features: [
        { title: 'RTX 4050', text: '6 ГБ GDDR6 и поддержка DLSS 3.', icon: 'gamepad' },
        { title: 'Ryzen 5 7640HS', text: '6 ядер и 12 потоков, до 5,0 ГГц.', icon: 'settings' },
        { title: '144 Гц', text: 'Экран 16,1″ для динамичных игр.', icon: 'tv' },
        { title: '70 Вт·ч', text: 'Ёмкая батарея для работы без розетки.', icon: 'clock' },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '16,1″', key: true },
          { label: 'Разрешение', value: '1920 × 1080 (Full HD)', key: true },
          { label: 'Частота обновления', value: '144 Гц' },
        ],
      },
      {
        title: 'Процессор',
        rows: [
          { label: 'Процессор', value: 'AMD Ryzen 5 7640HS', key: true },
          { label: 'Ядра и потоки', value: '6 ядер, 12 потоков' },
          { label: 'Частота', value: 'до 5,0 ГГц' },
        ],
      },
      {
        title: 'Память и накопитель',
        rows: [
          { label: 'Оперативная память', value: '16 ГБ', key: true },
          { label: 'Накопитель', value: '512 ГБ SSD', key: true },
        ],
      },
      {
        title: 'Графика',
        rows: [
          { label: 'Видеокарта', value: 'NVIDIA GeForce RTX 4050', key: true },
          { label: 'Видеопамять', value: '6 ГБ GDDR6' },
        ],
      },
      {
        title: 'Корпус и порты',
        rows: [
          { label: 'Цвет', value: 'Синий' },
          { label: 'Вес', value: 'от 2,33 кг' },
          { label: 'Видеовыход и сеть', value: 'HDMI 2.1, RJ-45' },
          { label: 'Модель', value: 'Victus 16-s0000' },
        ],
      },
      {
        title: 'Система и батарея',
        rows: [
          { label: 'Операционная система', value: 'Windows 11 Home', key: true },
          { label: 'Батарея', value: '70 Вт·ч' },
        ],
      },
    ],
  },
  {
    slug: 'acer-aspire-5-i5-512',
    category: 'laptops',
    attributes: [
      { label: 'Цвет', value: 'Серый' },
      { label: 'ОЗУ', value: '16 ГБ' },
      { label: 'SSD', value: '512 ГБ' },
    ],
    highlights: [
      'Процессор Intel Core i5-1335U',
      '16 ГБ оперативной памяти',
      'Экран Full HD 15,6″',
      'Порт Thunderbolt 4',
      'Wi-Fi 6E',
    ],
    description: {
      title: 'Рабочий ноутбук с Thunderbolt 4',
      paragraphs: [
        'Acer Aspire 5 построен на Intel Core i5-1335U с 10 ядрами и 16 ГБ оперативной памяти. Такой конфигурации хватает для офисных пакетов, видеоконференций, браузера с множеством вкладок и лёгкой обработки фото.',
        'Экран 15,6″ Full HD с IPS-матрицей сохраняет цвета под углом. Порт Thunderbolt 4 позволяет подключить док-станцию или монитор одним кабелем, а модуль Wi-Fi 6E поддерживает быстрые современные роутеры.',
      ],
      features: [
        { title: 'Intel Core i5', text: '10 ядер и 12 потоков, до 4,6 ГГц.', icon: 'settings' },
        { title: 'IPS Full HD', text: 'Экран 15,6″ с широкими углами обзора.', icon: 'tv' },
        { title: 'Thunderbolt 4', text: 'Док-станция или монитор одним кабелем.', icon: 'link' },
        { title: 'Wi-Fi 6E', text: 'Поддержка современных роутеров.', icon: 'check' },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '15,6″', key: true },
          { label: 'Разрешение', value: '1920 × 1080 (Full HD)', key: true },
          { label: 'Тип матрицы', value: 'IPS' },
        ],
      },
      {
        title: 'Процессор',
        rows: [
          { label: 'Процессор', value: 'Intel Core i5-1335U', key: true },
          { label: 'Ядра и потоки', value: '10 ядер, 12 потоков' },
          { label: 'Частота', value: 'до 4,6 ГГц' },
        ],
      },
      {
        title: 'Память и накопитель',
        rows: [
          { label: 'Оперативная память', value: '16 ГБ', key: true },
          { label: 'Накопитель', value: '512 ГБ SSD', key: true },
          { label: 'Тип памяти', value: 'LPDDR5' },
        ],
      },
      {
        title: 'Графика',
        rows: [
          { label: 'Видеокарта', value: 'Встроенная', key: true },
          { label: 'Графический процессор', value: 'Intel Iris Xe Graphics' },
        ],
      },
      {
        title: 'Корпус и порты',
        rows: [
          { label: 'Цвет', value: 'Серый' },
          { label: 'Вес', value: 'около 1,8 кг' },
          { label: 'Порты', value: 'Thunderbolt 4 (USB-C), 2 × USB-A 3.2 Gen 1, HDMI' },
          { label: 'Беспроводная связь', value: 'Wi-Fi 6E, Bluetooth' },
          { label: 'Модель', value: 'Aspire 5 A515-58M' },
        ],
      },
      {
        title: 'Система и батарея',
        rows: [
          { label: 'Операционная система', value: 'Windows 11 Home', key: true },
          { label: 'Веб-камера', value: 'Full HD 1080p' },
        ],
      },
    ],
  },
  {
    slug: 'acer-swift-go-14-ultra5',
    category: 'laptops',
    attributes: [
      { label: 'Цвет', value: 'Серебристый' },
      { label: 'ОЗУ', value: '16 ГБ' },
      { label: 'SSD', value: '512 ГБ' },
    ],
    highlights: [
      'Процессор Intel Core Ultra 5 125H',
      'Встроенный нейропроцессор Intel AI Boost',
      'Графика Intel Arc',
      'Два порта Thunderbolt 4',
      'Батарея 65 Вт·ч',
    ],
    description: {
      title: 'Лёгкий ноутбук на Intel Core Ultra',
      paragraphs: [
        'Acer Swift Go 14 работает на Intel Core Ultra 5 125H: 14 ядер, графика Intel Arc и нейропроцессор Intel AI Boost для функций с искусственным интеллектом. Корпус весит около 1,3 кг и легко помещается в рюкзак.',
        'Экран 14″ формата 16:10 удобен для документов и таблиц. Два порта Thunderbolt 4, HDMI 2.1 и слот microSD закрывают типовые задачи с периферией, а батарея на 65 Вт·ч помогает работать вдали от розетки.',
      ],
      features: [
        { title: 'Core Ultra 5', text: '14 ядер и 18 потоков, до 4,5 ГГц.', icon: 'settings' },
        { title: 'Intel AI Boost', text: 'Нейропроцессор для ИИ-функций.', icon: 'lightbulb' },
        { title: 'Thunderbolt 4', text: 'Два порта USB-C для дока и мониторов.', icon: 'link' },
        { title: '65 Вт·ч', text: 'Батарея для работы в дороге.', icon: 'clock' },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '14″', key: true },
          { label: 'Соотношение сторон', value: '16:10' },
        ],
      },
      {
        title: 'Процессор',
        rows: [
          { label: 'Процессор', value: 'Intel Core Ultra 5 125H', key: true },
          { label: 'Ядра и потоки', value: '14 ядер, 18 потоков' },
          { label: 'Частота', value: 'до 4,5 ГГц' },
          { label: 'Нейропроцессор', value: 'Intel AI Boost' },
        ],
      },
      {
        title: 'Память и накопитель',
        rows: [
          { label: 'Оперативная память', value: '16 ГБ', key: true },
          { label: 'Тип памяти', value: 'LPDDR5X' },
          { label: 'Накопитель', value: '512 ГБ SSD', key: true },
        ],
      },
      {
        title: 'Графика',
        rows: [
          { label: 'Видеокарта', value: 'Встроенная', key: true },
          { label: 'Графический процессор', value: 'Intel Arc Graphics' },
        ],
      },
      {
        title: 'Корпус и порты',
        rows: [
          { label: 'Цвет', value: 'Серебристый' },
          { label: 'Вес', value: 'около 1,3 кг', key: true },
          {
            label: 'Порты',
            value: '2 × Thunderbolt 4 (USB-C), HDMI 2.1, microSD',
          },
        ],
      },
      {
        title: 'Система и батарея',
        rows: [
          { label: 'Операционная система', value: 'Windows 11 Home', key: true },
          { label: 'Батарея', value: '65 Вт·ч' },
          { label: 'Модель', value: 'Swift Go 14 SFG14-72' },
        ],
      },
    ],
  },
  {
    slug: 'msi-katana-17-rtx4060',
    category: 'laptops',
    attributes: [
      { label: 'Цвет', value: 'Чёрный' },
      { label: 'ОЗУ', value: '16 ГБ' },
      { label: 'SSD', value: '1 ТБ' },
    ],
    highlights: [
      'Видеокарта NVIDIA GeForce RTX 4060',
      'Процессор Intel Core i7-13620H',
      'Экран 17,3″ с частотой 144 Гц',
      'SSD на 1 ТБ',
      'Память DDR5-5200',
    ],
    description: {
      title: 'Большой экран для игр и работы',
      paragraphs: [
        'MSI Katana 17 оснащён Intel Core i7-13620H с 10 ядрами и видеокартой NVIDIA GeForce RTX 4060 с 8 ГБ GDDR6. Конфигурация рассчитана на современные игры, монтаж видео и работу в 3D-редакторах.',
        'Экран 17,3″ с частотой 144 Гц даёт большое рабочее поле и плавную картинку. 16 ГБ памяти DDR5 и SSD на 1 ТБ вмещают несколько крупных игр, а для сети есть порт RJ-45.',
      ],
      features: [
        { title: 'RTX 4060', text: '8 ГБ GDDR6 и поддержка DLSS 3.', icon: 'gamepad' },
        { title: 'Core i7-13620H', text: '10 ядер и 16 потоков, до 4,9 ГГц.', icon: 'settings' },
        { title: '17,3″ и 144 Гц', text: 'Большой и плавный экран.', icon: 'tv' },
        { title: '1 ТБ SSD', text: 'Место для большой библиотеки игр.', icon: 'folder' },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '17,3″', key: true },
          { label: 'Разрешение', value: '1920 × 1080 (Full HD)', key: true },
          { label: 'Частота обновления', value: '144 Гц' },
          { label: 'Тип матрицы', value: 'IPS-уровня' },
        ],
      },
      {
        title: 'Процессор',
        rows: [
          { label: 'Процессор', value: 'Intel Core i7-13620H', key: true },
          { label: 'Ядра и потоки', value: '10 ядер, 16 потоков' },
          { label: 'Частота', value: 'до 4,9 ГГц' },
        ],
      },
      {
        title: 'Память и накопитель',
        rows: [
          { label: 'Оперативная память', value: '16 ГБ', key: true },
          { label: 'Тип памяти', value: 'DDR5-5200' },
          { label: 'Накопитель', value: '1 ТБ SSD', key: true },
        ],
      },
      {
        title: 'Графика',
        rows: [
          { label: 'Видеокарта', value: 'NVIDIA GeForce RTX 4060', key: true },
          { label: 'Видеопамять', value: '8 ГБ GDDR6' },
        ],
      },
      {
        title: 'Корпус и порты',
        rows: [
          { label: 'Цвет', value: 'Чёрный' },
          { label: 'Вес', value: '2,6 кг' },
          {
            label: 'Порты',
            value: 'USB-C 3.2 Gen 1, 2 × USB-A 3.2 Gen 1, USB-A 2.0, HDMI 2.1, RJ-45',
          },
          { label: 'Модель', value: 'Katana 17 B13VFK' },
        ],
      },
      {
        title: 'Система и батарея',
        rows: [
          { label: 'Операционная система', value: 'Windows 11 Home', key: true },
          { label: 'Батарея', value: '53,5 Вт·ч' },
        ],
      },
    ],
  },
  {
    slug: 'huawei-matebook-d16-i5',
    category: 'laptops',
    attributes: [
      { label: 'Цвет', value: 'Серый космос' },
      { label: 'ОЗУ', value: '16 ГБ' },
      { label: 'SSD', value: '512 ГБ' },
    ],
    highlights: [
      'Процессор Intel Core i5-13420H',
      'Экран 16″ формата 16:10',
      'USB-C с DisplayPort',
      '16 ГБ оперативной памяти',
      'Вес около 1,7 кг',
    ],
    description: {
      title: 'Большой экран в металлическом корпусе',
      paragraphs: [
        'HUAWEI MateBook D 16 работает на Intel Core i5-13420H с 8 ядрами и 12 потоками. 16 ГБ памяти и SSD на 512 ГБ рассчитаны на офисную работу, учёбу, таблицы и видеосвязь без задержек.',
        'Экран 16″ с разрешением 1920 × 1200 и форматом 16:10 вмещает больше строк текста и удобен для работы с двумя окнами. Ноутбук весит около 1,7 кг, а порт USB-C заряжает его и выводит изображение на монитор.',
      ],
      features: [
        { title: 'Core i5-13420H', text: '8 ядер и 12 потоков, до 4,6 ГГц.', icon: 'settings' },
        { title: 'Экран 16″', text: '1920 × 1200 и формат 16:10.', icon: 'tv' },
        { title: 'USB-C', text: 'Зарядка, данные и DisplayPort.', icon: 'link' },
        { title: 'Около 1,7 кг', text: 'Большой экран без лишнего веса.', icon: 'briefcase' },
      ],
    },
    specificationGroups: [
      {
        title: 'Экран',
        rows: [
          { label: 'Диагональ экрана', value: '16″', key: true },
          { label: 'Разрешение', value: '1920 × 1200', key: true },
          { label: 'Тип матрицы', value: 'IPS' },
          { label: 'Соотношение сторон', value: '16:10' },
        ],
      },
      {
        title: 'Процессор',
        rows: [
          { label: 'Процессор', value: 'Intel Core i5-13420H', key: true },
          { label: 'Ядра и потоки', value: '8 ядер, 12 потоков' },
          { label: 'Частота', value: 'до 4,6 ГГц' },
        ],
      },
      {
        title: 'Память и накопитель',
        rows: [
          { label: 'Оперативная память', value: '16 ГБ', key: true },
          { label: 'Накопитель', value: '512 ГБ SSD', key: true },
        ],
      },
      {
        title: 'Графика',
        rows: [
          { label: 'Видеокарта', value: 'Встроенная', key: true },
          { label: 'Графический процессор', value: 'Intel UHD Graphics' },
        ],
      },
      {
        title: 'Корпус и порты',
        rows: [
          { label: 'Цвет', value: 'Серый космос' },
          { label: 'Вес', value: 'около 1,7 кг' },
          { label: 'Порты', value: 'USB-C с DisplayPort, USB-A 3.2 Gen 1, USB-A 2.0, HDMI' },
        ],
      },
      {
        title: 'Система и батарея',
        rows: [
          { label: 'Операционная система', value: 'Windows 11 Home', key: true },
          { label: 'Модель', value: 'MateBook D 16 2024' },
        ],
      },
    ],
  },
];
