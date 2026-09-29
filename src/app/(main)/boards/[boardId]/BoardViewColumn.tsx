import { Column, Heading, Row, Text } from '@umami/react-zen';
import { Empty } from '@/components/common/Empty';
import NextLink from '@/components/common/Link';
import { Panel } from '@/components/common/Panel';
import { useBoard } from '@/components/hooks';
import { getBoardType, getResolvedComponentEntity, isOpenBoardType } from '@/lib/boards';
import type { BoardComponentConfig } from '@/lib/types';
import { BoardEntityBadge } from '../BoardEntityBadge';
import { getComponentDefinition } from '../boardComponentRegistry';
import { useBoardEntityAvailability } from '../useBoardEntityAvailability';
import { useBoardEntityBadgeProps } from '../useBoardEntityBadgeProps';
import { useBoardEntityHref } from '../useBoardEntityHref';
import { BoardComponentRenderer } from './BoardComponentRenderer';

export function BoardViewColumn({
  component,
  showEntityBadge = true,
}: {
  component?: BoardComponentConfig;
  showEntityBadge?: boolean;
}) {
  const { board } = useBoard();
  const boardType = getBoardType(board);
  const definition = component ? getComponentDefinition(component.type) : undefined;
  const { entityType, entityId } = getResolvedComponentEntity(board, component);
  const entityBadge = useBoardEntityBadgeProps(entityType, entityId, showEntityBadge);
  const { isLoading, isUnavailable } = useBoardEntityAvailability(entityType, entityId);
  const entityHref = useBoardEntityHref(entityType, entityId);

  if (!component || (!entityId && definition?.requiresWebsite !== false)) {
    return null;
  }

  const title = component.title;
  const description = component.description;

  const showBadge = showEntityBadge && isOpenBoardType(boardType) && !!entityBadge;

  const heading = title && (
    <Heading>{entityHref ? <NextLink href={entityHref}>{title}</NextLink> : title}</Heading>
  );

  return (
    <Panel height="100%">
      {showBadge ? (
        <Row justifyContent={title ? 'space-between' : 'flex-end'} alignItems="center">
          {heading}
          <BoardEntityBadge {...entityBadge} href={entityHref} />
        </Row>
      ) : (
        heading
      )}
      {description && <Text color="muted">{description}</Text>}
      <Column width="100%" height="100%" style={{ minHeight: 0 }}>
        <Column width="100%" flexGrow={1} style={{ minHeight: 0 }}>
          {!isLoading &&
            (isUnavailable ? (
              <Empty message="Selected item is no longer available." />
            ) : (
              <BoardComponentRenderer
                config={component}
                websiteId={entityId}
                entityType={entityType}
              />
            ))}
        </Column>
      </Column>
    </Panel>
  );
}
