import { permanentRedirect } from 'next/navigation';

export default function DocsRoot() {
  permanentRedirect('/sdks/nextjs/quickstart');
}
