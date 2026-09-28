import { useState } from 'react';

import { Icon } from '../../components/ui';
import type { IconName } from '../../components/ui';

interface ShareTarget {
  readonly icon: IconName;
  readonly label: string;
  readonly href: (url: string, title: string) => string;
}

const SHARE_TARGETS: readonly ShareTarget[] = [
  {
    icon: 'vk',
    label: 'Поделиться во ВКонтакте',
    href: (url, title) =>
      `https://vk.com/share.php?${new URLSearchParams({ url, title }).toString()}`,
  },
  {
    icon: 'telegram',
    label: 'Поделиться в Telegram',
    href: (url, title) =>
      `https://t.me/share/url?${new URLSearchParams({ url, text: title }).toString()}`,
  },
  {
    icon: 'whatsapp',
    label: 'Поделиться в WhatsApp',
    href: (url, title) =>
      `https://wa.me/?${new URLSearchParams({ text: `${title} ${url}` }).toString()}`,
  },
  {
    icon: 'x',
    label: 'Поделиться в X',
    href: (url, title) =>
      `https://x.com/intent/post?${new URLSearchParams({ url, text: title }).toString()}`,
  },
];

type CopyState = 'idle' | 'copied' | 'failed';

const COPY_MESSAGES: Readonly<Record<CopyState, string>> = {
  idle: '',
  copied: 'Ссылка скопирована',
  failed: 'Не удалось скопировать ссылку',
};

interface BlogArticleShareProps {
  readonly url: string;
  readonly title: string;
}

export function BlogArticleShare({ url, title }: BlogArticleShareProps) {
  const [copyState, setCopyState] = useState<CopyState>('idle');

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  };

  return (
    <div className="blog-share">
      <p className="blog-share__label" id="blog-share-label">
        Поделиться статьей
      </p>
      <ul aria-labelledby="blog-share-label" className="blog-share__list">
        {SHARE_TARGETS.map((target) => (
          <li key={target.icon}>
            <a
              aria-label={`${target.label} (откроется в новой вкладке)`}
              className="blog-share__control"
              href={target.href(url, title)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon className="blog-share__icon" name={target.icon} />
            </a>
          </li>
        ))}
        <li>
          <button
            aria-label="Скопировать ссылку на статью"
            className="blog-share__control"
            onClick={() => {
              void copyLink();
            }}
            type="button"
          >
            <Icon className="blog-share__icon" name="link" />
          </button>
        </li>
      </ul>
      <p className="blog-share__status" role="status">
        {COPY_MESSAGES[copyState]}
      </p>
    </div>
  );
}
