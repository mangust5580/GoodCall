import { Icon } from '../ui';
import type { IconName } from '../ui';

export interface AccountStatsMetric {
  readonly id: string;
  readonly icon: IconName;
  readonly label: string;
  readonly value: string;
  readonly delta?: string;
  readonly note?: string;
  readonly link?: { readonly href: string; readonly label: string };
}

interface AccountStatsProps {
  readonly metrics: readonly AccountStatsMetric[];
  readonly layout?: 'list' | 'tiles';
}

export function AccountStats({ metrics, layout = 'list' }: AccountStatsProps) {
  return (
    <dl className={layout === 'tiles' ? 'account-stats account-stats--tiles' : 'account-stats'}>
      {metrics.map((metric) => (
        <div className="account-stats__metric" key={metric.id}>
          <dt className="account-stats__label">
            <span className="account-stats__glyph">
              <Icon className="account-stats__icon" name={metric.icon} />
            </span>
            <span className="account-stats__name">{metric.label}</span>
          </dt>
          <dd className="account-stats__data">
            <span className="account-stats__value">{metric.value}</span>
            {metric.delta === undefined ? null : (
              <span className="account-stats__delta">{metric.delta}</span>
            )}
          </dd>
          {metric.note === undefined && metric.link === undefined ? null : (
            <dd className="account-stats__extra">
              {metric.note === undefined ? null : (
                <span className="account-stats__note">{metric.note}</span>
              )}
              {metric.link === undefined ? null : (
                <a className="account-stats__link" href={metric.link.href}>
                  {metric.link.label}
                </a>
              )}
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}
