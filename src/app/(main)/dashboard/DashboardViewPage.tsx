'use client';
import { Column } from '@umami/react-zen';
import { useEffect } from 'react';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { useMessages, useNavigation } from '@/components/hooks';
import { DashboardWebsites } from './DashboardWebsites';

export function DashboardViewPage() {
  const { teamId, router } = useNavigation();
  const { t, labels } = useMessages();

  useEffect(() => {
    if (teamId) {
      router.replace('/dashboard');
    }
  }, [teamId, router]);

  if (teamId) {
    return null;
  }

  return (
    <PageBody>
      <Column>
        <PageHeader title={t(labels.dashboard)} />
        <DashboardWebsites />
      </Column>
    </PageBody>
  );
}
