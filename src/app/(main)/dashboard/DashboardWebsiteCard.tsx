import { Column, Grid, Icon, Row, Text } from '@umami/react-zen';
import { Favicon } from '@/components/common/Favicon';
import Link from '@/components/common/Link';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { useDateRange, useMessages, useNavigation, useTimezone } from '@/components/hooks';
import { useWebsitePageviewsQuery } from '@/components/hooks/queries/useWebsitePageviewsQuery';
import { useWebsiteStatsQuery } from '@/components/hooks/queries/useWebsiteStatsQuery';
import { ChangeLabel } from '@/components/metrics/ChangeLabel';
import { PageviewsChart } from '@/components/metrics/PageviewsChart';
import { formatLongNumber, formatShortTime } from '@/lib/format';
import styles from './DashboardWebsiteCard.module.css';

function getPercentChange(value: number, change: number) {
  const prev = value - change;
  const pct = prev !== 0 ? (change / prev) * 100 : value !== 0 ? 100 : 0;

  return Number(pct) || 0;
}

function DashboardWebsiteMetrics({ websiteId }: { websiteId: string }) {
  const { isAllTime } = useDateRange();
  const { t, labels } = useMessages();
  const { data } = useWebsiteStatsQuery({ websiteId });

  if (!data) {
    return null;
  }

  const { pageviews, visitors, visits, bounces, totaltime, comparison } = data;
  const bounceRate = (Math.min(visits, bounces) / visits) * 100 || 0;
  const prevBounceRate =
    (Math.min(comparison.visits, comparison.bounces) / comparison.visits) * 100 || 0;
  const duration = totaltime / visits || 0;
  const prevDuration = comparison.totaltime / comparison.visits || 0;

  const metrics = [
    {
      label: t(labels.visitors),
      value: visitors,
      change: visitors - comparison.visitors,
      formatValue: formatLongNumber,
    },
    {
      label: t(labels.visits),
      value: visits,
      change: visits - comparison.visits,
      formatValue: formatLongNumber,
    },
    {
      label: t(labels.views),
      value: pageviews,
      change: pageviews - comparison.pageviews,
      formatValue: formatLongNumber,
    },
    {
      label: t(labels.bounceRate),
      value: bounceRate,
      change: bounceRate - prevBounceRate,
      formatValue: (n: number) => `${Math.round(+n)}%`,
      reverseColors: true,
    },
    {
      label: t(labels.visitDuration),
      value: duration,
      change: duration - prevDuration,
      formatValue: (n: number) =>
        `${+n < 0 ? '-' : ''}${formatShortTime(Math.abs(~~n), ['m', 's'], ' ')}`,
    },
  ];

  return (
    <Grid columns="repeat(auto-fit, minmax(80px, 1fr))" gap="3">
      {metrics.map(({ label, value, change, formatValue, reverseColors }) => (
        <Column key={label} gap="1">
          <Text size="sm" color="muted" truncate title={label}>
            {label}
          </Text>
          <Text size="lg" weight="bold" wrap="nowrap">
            {formatValue(value)}
          </Text>
          {!isAllTime && (
            <ChangeLabel
              value={change}
              title={formatValue(change)}
              reverseColors={reverseColors}
              size="xs"
            >
              <Text size="xs">{`${Math.abs(~~getPercentChange(value, change))}%`}</Text>
            </ChangeLabel>
          )}
        </Column>
      ))}
    </Grid>
  );
}

function DashboardWebsiteChart({ websiteId }: { websiteId: string }) {
  const { timezone } = useTimezone();
  const { dateRange } = useDateRange({ timezone });
  const { startDate, endDate, unit, value } = dateRange;
  const { data, isLoading, isFetching, error } = useWebsitePageviewsQuery({ websiteId });
  const { pageviews = [], sessions = [] } = (data || {}) as any;

  return (
    <LoadingPanel data={data} isFetching={isFetching} isLoading={isLoading} error={error}>
      <PageviewsChart
        key={value}
        data={{ pageviews, sessions }}
        minDate={startDate}
        maxDate={endDate}
        unit={unit}
        height="200px"
      />
    </LoadingPanel>
  );
}

export function DashboardWebsiteCard({
  website,
}: {
  website: { id: string; name: string; domain?: string };
}) {
  const { renderUrl } = useNavigation();

  return (
    <Link href={renderUrl(`/websites/${website.id}`)} className={styles.card}>
      <Column
        paddingY="4"
        paddingX={{ base: '3', md: '5' }}
        gap="4"
        border
        borderRadius
        backgroundColor="surface"
        height="100%"
      >
        <Row alignItems="center" gap="2" minWidth="0">
          <Icon size="sm" style={{ flexShrink: 0 }}>
            <Favicon domain={website.domain} />
          </Icon>
          <Text weight="bold" truncate>
            {website.name}
          </Text>
          {website.domain && (
            <Text size="sm" color="muted" truncate>
              {website.domain}
            </Text>
          )}
        </Row>
        <DashboardWebsiteMetrics websiteId={website.id} />
        <DashboardWebsiteChart websiteId={website.id} />
      </Column>
    </Link>
  );
}
