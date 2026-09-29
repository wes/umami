import { Box, Column, Grid, Loading } from '@umami/react-zen';
import { WebsiteControls } from '@/app/(main)/websites/[websiteId]/WebsiteControls';
import { Empty } from '@/components/common/Empty';
import { useLoginQuery, useMessages, useUserWebsitesQuery } from '@/components/hooks';
import { DashboardWebsiteCard } from './DashboardWebsiteCard';

export function DashboardWebsites() {
  const { user } = useLoginQuery();
  const { t, messages } = useMessages();
  const { data, isLoading } = useUserWebsitesQuery(
    { userId: user?.id },
    { pageSize: 500, includeTeams: 1 },
  );
  const websites = data?.data ?? [];

  if (isLoading) {
    return <Loading placement="absolute" />;
  }

  if (!websites.length) {
    return <Empty message={t(messages.noWebsitesConfigured)} />;
  }

  return (
    <Column>
      <Box marginBottom="4">
        <WebsiteControls websiteId={websites[0].id} />
      </Box>
      <Grid columns={{ base: '1fr', xl: '1fr 1fr' }} gap="3">
        {websites.map(website => (
          <DashboardWebsiteCard key={website.id} website={website} />
        ))}
      </Grid>
    </Column>
  );
}
