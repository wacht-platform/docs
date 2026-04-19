import type { BackendDoc } from '@/components/shared-backend-pages.types';

export const segmentsBackendDocs: BackendDoc[] = [
  {
    slug: 'list-segments',
    path: ['segments', 'list-segments'],
    title: 'listSegments()',
    description: 'List segments in the current deployment.',
    intro: 'Returns paginated segments with optional search and sorting.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listSegments() {
  const client = await wachtClient();
  return client.segments.listSegments({ limit: 20, search: 'beta' });
}`,
    signature: `function listSegments(
  options?: ListSegmentsOptions,
): Promise<PaginatedResponse<Segment>>`,
    sections: [
      {
        title: 'Behavior',
        points: [
          'Returns a backend-scoped list response for this resource.',
          'Use pagination and filters from this method to build admin list views.',
        ],
      },
    ],
  },
  {
    slug: 'create-segment',
    path: ['segments', 'create-segment'],
    title: 'createSegment()',
    description: 'Create a new segment.',
    intro: 'Creates a segment by name and target type.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function createSegment() {
  const client = await wachtClient();
  return client.segments.createSegment({
    name: 'High Value Customers',
    type: 'user',
  });
}`,
    signature: `function createSegment(
  request: CreateSegmentRequest,
): Promise<Segment>`,
    paramsTitle: 'CreateSegmentRequest',
    params: [
      { name: 'name', type: 'string', description: 'Segment display name.' },
      { name: 'type', type: `'organization' | 'workspace' | 'user'`, description: 'Segment target type.' },
    ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Creates a new resource and returns the created object from the backend.',
          'Validate required fields before calling to avoid predictable request failures.',
        ],
      },
    ],
  },
  {
    slug: 'update-segment',
    path: ['segments', 'update-segment'],
    title: 'updateSegment()',
    description: 'Update a segment by id.',
    intro: 'Updates mutable segment fields. Currently this is name-only.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function renameSegment(segmentId: string) {
  const client = await wachtClient();
  return client.segments.updateSegment(segmentId, { name: 'Enterprise Customers' });
}`,
    signature: `function updateSegment(
  segmentId: string,
  request: UpdateSegmentRequest,
): Promise<Segment>`,
    params: [
      { name: 'segmentId', type: 'string', description: 'Segment id.' },
      { name: 'request.name', type: 'string | undefined', description: 'New segment name.' },
    ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Applies a partial update and returns the server-side updated resource.',
          'Treat omitted optional fields as unchanged unless explicitly documented otherwise.',
        ],
      },
    ],
  },
  {
    slug: 'delete-segment',
    path: ['segments', 'delete-segment'],
    title: 'deleteSegment()',
    description: 'Delete a segment by id.',
    intro: 'Deletes a segment and resolves with a backend response object.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function deleteSegment(segmentId: string) {
  const client = await wachtClient();
  return client.segments.deleteSegment(segmentId);
}`,
    signature: `function deleteSegment(
  segmentId: string,
): Promise<Record<string, unknown>>`,
    params: [{ name: 'segmentId', type: 'string', description: 'Segment id to delete.' }],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Performs a destructive operation against the target resource.',
          'Callers should treat this as irreversible unless a separate restore flow exists.',
        ],
      },
    ],
  },
  {
    slug: 'assign-to-segment',
    path: ['segments', 'assign-to-segment'],
    title: 'assignToSegment()',
    description: 'Assign an entity to a segment.',
    intro: 'Assigns a target entity id to a segment.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function assignToSegment(segmentId: string, entityId: string) {
  const client = await wachtClient();
  return client.segments.assignToSegment(segmentId, entityId);
}`,
    signature: `function assignToSegment(
  segmentId: string,
  entityId: string,
): Promise<Record<string, unknown>>`,
    params: [
      { name: 'segmentId', type: 'string', description: 'Segment id.' },
      { name: 'entityId', type: 'string', description: 'Entity id to assign.' },
    ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Creates an association between the target entity and segment.',
          'Call this after validating both ids exist in your application context.',
        ],
      },
    ],
  },
  {
    slug: 'remove-from-segment',
    path: ['segments', 'remove-from-segment'],
    title: 'removeFromSegment()',
    description: 'Remove an entity from a segment.',
    intro: 'Removes a target entity id from a segment.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function removeFromSegment(segmentId: string, entityId: string) {
  const client = await wachtClient();
  return client.segments.removeFromSegment(segmentId, entityId);
}`,
    signature: `function removeFromSegment(
  segmentId: string,
  entityId: string,
): Promise<Record<string, unknown>>`,
    params: [
      { name: 'segmentId', type: 'string', description: 'Segment id.' },
      { name: 'entityId', type: 'string', description: 'Entity id to remove.' },
    ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Performs a destructive operation against the target resource.',
          'Callers should treat this as irreversible unless a separate restore flow exists.',
        ],
      },
    ],
  },
  {
    slug: 'get-segment-data',
    path: ['segments', 'get-segment-data'],
    title: 'getSegmentData()',
    description: 'Query segment-capable entities by filters.',
    intro: 'Returns paginated analyzed entities for the requested target type and filters.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function getUserSegmentData() {
  const client = await wachtClient();
  return client.segments.getSegmentData({
    target_type: 'user',
    filters: {
      user: { email: '@example.com' },
    },
  });
}`,
    signature: `function getSegmentData(
  request: SegmentDataRequest,
): Promise<PaginatedResponse<AnalyzedEntity>>`,
    paramsTitle: 'SegmentDataRequest',
    params: [
      { name: 'target_type', type: `'user' | 'organization' | 'workspace'`, description: 'Entity type to query.' },
      { name: 'filters', type: 'SegmentDataFilters | undefined', description: 'Optional per-target filter object.' },
    ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Fetches a single resource by identifier or query context.',
          'Use this result as the source of truth before update, replay, or delete flows.',
        ],
      },
    ],
  },
];
