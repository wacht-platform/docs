import type { BackendDoc } from '@/components/shared-backend-pages.types';

export const segmentsGeneratedDocOverrides: Record<string, Partial<BackendDoc>> = {
  listSegments: {
    description: 'List deployment segments.',
    intro: 'Returns paginated segments with optional filtering and sorting.',
    signature: `function listSegments(
  options?: ListSegmentsOptions,
): Promise<PaginatedResponse<Segment>>`,
    paramsTitle: 'ListSegmentsOptions',
    params: [
      { name: 'options.limit', type: 'number | undefined', description: 'Maximum page size.' },
      { name: 'options.offset', type: 'number | undefined', description: 'Result offset.' },
      { name: 'options.search', type: 'string | undefined', description: 'Search term by segment name.' },
      { name: 'options.sort_key', type: 'string | undefined', description: 'Sort field.' },
      { name: 'options.sort_order', type: 'string | undefined', description: 'Sort direction.' },
    ],
  },
  createSegment: {
    description: 'Create a segment.',
    intro: 'Creates a segment for users, organizations, or workspaces.',
    signature: `function createSegment(request: CreateSegmentRequest): Promise<Segment>`,
    paramsTitle: 'CreateSegmentRequest',
    params: [
      { name: 'name', type: 'string', description: 'Segment display name.' },
      { name: 'type', type: `'organization' | 'workspace' | 'user'`, description: 'Segment target entity type.' },
    ],
  },
  updateSegment: {
    description: 'Update one segment.',
    intro: 'Patches segment metadata for one segment id.',
    signature: `function updateSegment(
  segmentId: string,
  request: UpdateSegmentRequest,
): Promise<Segment>`,
    paramsTitle: 'UpdateSegmentRequest',
    params: [
      { name: 'segmentId', type: 'string', description: 'Target segment id.' },
      { name: 'name', type: 'string | undefined', description: 'Updated segment name.' },
    ],
  },
  deleteSegment: {
    description: 'Delete one segment.',
    intro: 'Deletes one segment by id.',
    signature: `function deleteSegment(segmentId: string): Promise<Record<string, unknown>>`,
    params: [{ name: 'segmentId', type: 'string', description: 'Segment id to remove.' }],
  },
  assignToSegment: {
    description: 'Assign one entity to a segment.',
    intro: 'Assigns one entity id to a segment.',
    signature: `function assignToSegment(
  segmentId: string,
  entityId: string,
): Promise<Record<string, unknown>>`,
    params: [
      { name: 'segmentId', type: 'string', description: 'Target segment id.' },
      { name: 'entityId', type: 'string', description: 'Entity id to assign.' },
    ],
  },
  removeFromSegment: {
    description: 'Remove one entity from a segment.',
    intro: 'Removes one entity id from a segment.',
    signature: `function removeFromSegment(
  segmentId: string,
  entityId: string,
): Promise<Record<string, unknown>>`,
    params: [
      { name: 'segmentId', type: 'string', description: 'Target segment id.' },
      { name: 'entityId', type: 'string', description: 'Entity id to remove.' },
    ],
  },
  getSegmentData: {
    description: 'Analyze and list entities for segment-style filters.',
    intro: 'Returns matching entities for the provided segment data filters.',
    signature: `function getSegmentData(
  request: SegmentDataRequest,
): Promise<PaginatedResponse<AnalyzedEntity>>`,
    paramsTitle: 'SegmentDataRequest',
    params: [
      { name: 'target_type', type: `'user' | 'organization' | 'workspace'`, description: 'Entity type to analyze.' },
      {
        name: 'filters',
        type: 'SegmentDataFilters | undefined',
        description: 'Optional segment and field filters.',
        children: [
          {
            name: 'segment',
            type: 'Record<string, unknown> | undefined',
            description: 'Segment-level filter options.',
            children: [
              { name: 'ids', type: 'string[] | undefined', description: 'Filter to specific segment ids.' },
              { name: 'names', type: 'string[] | undefined', description: 'Filter to specific segment names.' },
            ],
          },
          {
            name: 'user',
            type: 'Record<string, unknown> | undefined',
            description: 'User-field filters when `target_type` is `user`.',
            children: [
              { name: 'email', type: 'string | undefined', description: 'Email/text filter.' },
              {
                name: 'created_at',
                type: 'Record<string, unknown> | undefined',
                description: 'Date-range style filter object.',
                children: [
                  { name: 'from', type: 'string | undefined', description: 'Inclusive range start (ISO-8601).' },
                  { name: 'to', type: 'string | undefined', description: 'Inclusive range end (ISO-8601).' },
                ],
              },
            ],
          },
          {
            name: 'organization',
            type: 'Record<string, unknown> | undefined',
            description: 'Organization-field filters when `target_type` is `organization`.',
            children: [
              { name: 'name', type: 'string | undefined', description: 'Organization name/text filter.' },
              {
                name: 'created_at',
                type: 'Record<string, unknown> | undefined',
                description: 'Date-range style filter object.',
                children: [
                  { name: 'from', type: 'string | undefined', description: 'Inclusive range start (ISO-8601).' },
                  { name: 'to', type: 'string | undefined', description: 'Inclusive range end (ISO-8601).' },
                ],
              },
            ],
          },
          {
            name: 'workspace',
            type: 'Record<string, unknown> | undefined',
            description: 'Workspace-field filters when `target_type` is `workspace`.',
            children: [
              { name: 'name', type: 'string | undefined', description: 'Workspace name/text filter.' },
              {
                name: 'created_at',
                type: 'Record<string, unknown> | undefined',
                description: 'Date-range style filter object.',
                children: [
                  { name: 'from', type: 'string | undefined', description: 'Inclusive range start (ISO-8601).' },
                  { name: 'to', type: 'string | undefined', description: 'Inclusive range end (ISO-8601).' },
                ],
              },
            ],
          },
        ],
      },
    ],
    api: [
      { name: 'data', type: 'AnalyzedEntity[]', description: 'Matching entities for this query.' },
      { name: 'has_more', type: 'boolean', description: 'Whether more results are available.' },
    ],
  },
};
