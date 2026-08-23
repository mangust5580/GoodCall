import { Icon } from '../ui';
import type { IconName } from '../ui';

export interface AccountStatsMetric {
  readonly id: string;
  readonly icon: IconName;
  readonly label: string;
  readonly value: string;
  readonly delta?: string;
}

interface AccountStatsProps {
  readonly metrics: readonly AccountStatsMetric[];
}

export function AccountStats({ metrics }: AccountStatsProps) {
  return (
    <dl className="account-stats">
      {metrics.map((metric) => (
        <div className="account-stats__metric" key={metric.id}>
          <dt className="account-stats__label">
            <Icon className="account-stats__icon" name={metric.icon} />
            <span className="account-stats__name">{metric.label}</span>
          </dt>
          <dd className="account-stats__data">
            <span className="account-stats__value">{metric.value}</span>
            {metric.delta === undefined ? null : (
              <span className="account-stats__delta">{metric.delta}</span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
