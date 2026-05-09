export function getDocsArea(pathname: string) {
  const path = pathname.startsWith('/docs') ? pathname.slice('/docs'.length) || '/' : pathname;

  if (path === '/') return 'home';
  if (path.startsWith('/reference/frontend-api')) return 'frontend_api_reference';
  if (path.startsWith('/reference/backend-api')) return 'backend_api_reference';
  if (path.startsWith('/reference')) return 'api_reference';
  if (path.startsWith('/guides')) return 'guides';
  if (path.startsWith('/product')) return 'product';
  if (path.startsWith('/sdks/nextjs')) return 'nextjs_sdk';
  if (path.startsWith('/sdks/react-router')) return 'react_router_sdk';
  if (path.startsWith('/sdks/tanstack-router')) return 'tanstack_router_sdk';
  if (path.startsWith('/sdks/node')) return 'node_sdk';
  if (path.startsWith('/sdks/rust')) return 'rust_sdk';
  if (path.startsWith('/sdks')) return 'sdks';

  return 'docs';
}
