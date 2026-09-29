import { useNavigation, useShare } from '@/components/hooks';
import type { BoardEntityType } from '@/lib/boards';

export function useBoardEntityHref(entityType?: BoardEntityType, entityId?: string) {
  const { renderUrl } = useNavigation();
  const share = useShare();

  // Share viewers can't access entity detail pages
  if (share || !entityType || !entityId) {
    return undefined;
  }

  return renderUrl(`/${entityType}s/${entityId}`);
}
