import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <p className="mb-4 font-mono text-sm text-muted-foreground">404</p>
      <h1 className="mb-3 text-3xl font-semibold tracking-tight text-foreground">
        Page not found
      </h1>
      <p className="mb-8 max-w-sm text-sm text-muted-foreground">
        This page doesn't exist or has been moved. Try searching the docs or head back to the homepage.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="rounded border border-border bg-background px-4 py-2 text-sm text-foreground transition-colors hover:bg-white/4"
        >
          Browse docs
        </Link>
        <Link
          href="/reference"
          className="rounded border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/4 hover:text-foreground"
        >
          API reference
        </Link>
      </div>
    </div>
  );
}
