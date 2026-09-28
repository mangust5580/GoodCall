import { BLOG_DETAIL_MEDIA } from '../../assets/media/blog/blogMedia';
import { Picture } from '../../components/media';
import { Icon } from '../../components/ui';
import type { IconName } from '../../components/ui';

interface UsageScenario {
  readonly icon: IconName;
  readonly label: string;
}

interface SpecItem {
  readonly term: string;
  readonly text: string;
}

const USAGE_SCENARIOS: readonly UsageScenario[] = [
  { icon: 'message', label: 'Общение и соцсети' },
  { icon: 'gamepad', label: 'Игры и развлечения' },
  { icon: 'camera', label: 'Фото и видео' },
  { icon: 'briefcase', label: 'Работа и учеба' },
];

const SPEC_ITEMS: readonly SpecItem[] = [
  { term: 'Процессор', text: 'от него зависит скорость работы и плавность интерфейса.' },
  { term: 'Оперативная память', text: 'оптимально от 6 ГБ для комфортной многозадачности.' },
  {
    term: 'Хранилище',
    text: '128 ГБ — разумный минимум, если не планируете хранить много фото и видео.',
  },
  { term: 'Батарея', text: 'емкость от 4500 мАч обеспечивает день активного использования.' },
  { term: 'Поддержка 5G', text: 'актуально для тех, кто хочет быть готовым к будущему.' },
];

const KEY_TIPS: readonly string[] = [
  'Определите свои задачи и частоту использования смартфона.',
  'Сравните ключевые характеристики и отзывы пользователей.',
  'Обратите внимание на качество экрана и автономность.',
  'Не переплачивайте за функции, которыми не будете пользоваться.',
];

const SPEC_MEDIA_SIZES = '(max-width: 767px) min(calc(100vw - 32px), 420px), 300px';
const CAMERA_MEDIA_SIZES =
  '(max-width: 899px) calc(100vw - 32px), (max-width: 1023px) 540px, (max-width: 1440px) calc((100vw - 460px) * 0.6), 580px';
const TARGET_MEDIA_SIZES = '(max-width: 559px) 120px, 200px';

export function HowToChooseSmartphone2024Body() {
  return (
    <div className="blog-article__body">
      <p className="blog-article__lead">
        Смартфон — наш главный помощник в работе, учебе, развлечениях и общении. В 2024 году рынок
        предлагает сотни моделей на любой вкус и бюджет. Разбираемся, как не запутаться в
        характеристиках и выбрать устройство, которое действительно подойдет именно вам.
      </p>

      <h2 className="blog-article__heading">Определите сценарии использования</h2>
      <p className="blog-article__text">
        Прежде чем смотреть характеристики, подумайте, как вы будете использовать смартфон. Для
        звонков, мессенджеров и соцсетей подойдут доступные модели. Если важны игры, съемка фото и
        видео или работа с документами — потребуется более производительное устройство с
        качественным экраном и батареей.
      </p>
      <ul className="blog-article__scenarios">
        {USAGE_SCENARIOS.map((scenario) => (
          <li className="blog-article__scenario" key={scenario.label}>
            <Icon className="blog-article__scenario-icon" name={scenario.icon} />
            <span className="blog-article__scenario-label">{scenario.label}</span>
          </li>
        ))}
      </ul>

      <div className="blog-article__split">
        <div className="blog-article__split-text">
          <h2 className="blog-article__heading">На что смотреть в характеристиках</h2>
          <p className="blog-article__text">
            Основные параметры, на которые стоит обратить внимание при выборе смартфона в 2024 году:
          </p>
          <ul className="blog-article__list">
            {SPEC_ITEMS.map((item) => (
              <li key={item.term}>
                <strong className="blog-article__term">{item.term}:</strong> {item.text}
              </li>
            ))}
          </ul>
        </div>
        <Picture
          alt="Смартфон с надписью 5G на экране над раскрытой ладонью"
          className="blog-article__spec-media"
          sizes={SPEC_MEDIA_SIZES}
          source={BLOG_DETAIL_MEDIA.smartphone5g}
        />
      </div>

      <h2 className="blog-article__heading">Экран, камера и автономность</h2>
      <p className="blog-article__text">
        Экран — это то, что вы видите каждый день. Выбирайте AMOLED или LTPO-панели с частотой
        обновления 90–120 Гц для комфортной картинки. Для любителей фото важны не только
        мегапиксели, но и оптика, стабилизация и возможности ночной съемки. А емкая батарея с
        быстрой зарядкой сэкономит ваше время.
      </p>
      <div className="blog-article__media-row">
        <Picture
          alt="Блок из трех камер смартфона крупным планом"
          className="blog-article__camera-media"
          sizes={CAMERA_MEDIA_SIZES}
          source={BLOG_DETAIL_MEDIA.cameraMacro}
        />
        <aside aria-labelledby="blog-article-tip-title" className="blog-article__tip">
          <Icon className="blog-article__tip-icon" name="lightbulb" />
          <p className="blog-article__tip-title" id="blog-article-tip-title">
            Совет
          </p>
          <p className="blog-article__tip-text">
            Обращайте внимание на реальные примеры фото и видео, а не только на цифры в
            характеристиках.
          </p>
        </aside>
      </div>

      <h2 className="blog-article__heading">Стоит ли переплачивать за флагман</h2>
      <p className="blog-article__text">
        Флагманы предлагают максимум возможностей, но не всем они нужны. Если вам не важны съемка в
        8K, беспроводная зарядка на 15 Вт и топовые материалы корпуса — присмотритесь к моделям
        среднего класса. Они предлагают отличный баланс цены и возможностей.
      </p>

      <section aria-labelledby="blog-article-tips-title" className="blog-article__tips">
        <div className="blog-article__tips-content">
          <h2 className="blog-article__tips-title" id="blog-article-tips-title">
            Ключевые советы
          </h2>
          <ul className="blog-article__tips-list">
            {KEY_TIPS.map((tip) => (
              <li className="blog-article__tips-item" key={tip}>
                <span className="blog-article__tips-mark">
                  <Icon className="blog-article__tips-check" name="check" />
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
        <Picture
          alt=""
          className="blog-article__tips-art"
          sizes={TARGET_MEDIA_SIZES}
          source={BLOG_DETAIL_MEDIA.target}
        />
      </section>
    </div>
  );
}
