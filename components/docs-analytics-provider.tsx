'use client';

import { PostHogProvider } from '@posthog/react';
import posthog from 'posthog-js';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';
import { getDocsArea } from '@/lib/docs-analytics';

let initialized = false;

function initPostHog() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return false;
  if (initialized) return true;

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: '2026-01-30',
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: false,
  });
  initialized = true;

  return true;
}

export function DocsAnalyticsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lastUrl = useRef<string | null>(null);

  useEffect(() => {
    initPostHog();
  }, []);

  useEffect(() => {
    if (!initPostHog()) return;

    const url = `${window.location.pathname}${window.location.search}`;
    if (lastUrl.current === url) return;
    lastUrl.current = url;

    posthog.capture('$pageview', {
      $current_url: window.location.href,
      docs_area: getDocsArea(window.location.pathname),
      path: window.location.pathname,
      title: document.title,
    });
  }, [pathname]);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
