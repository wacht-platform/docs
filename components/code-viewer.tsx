'use client';

import { useEffect, useMemo, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import type { Extension } from '@codemirror/state';

type CodeLanguage = 'typescript' | 'json' | 'text';

function extensionsForLanguage(language: CodeLanguage): Extension[] {
  switch (language) {
    case 'typescript':
      return [javascript({ typescript: true, jsx: true })];
    case 'json':
      return [json()];
    default:
      return [];
  }
}

export function CodeViewer({
  value,
  language = 'typescript',
  minHeight = 96,
}: {
  value: string;
  language?: CodeLanguage;
  minHeight?: number;
}) {
  const [isDark, setIsDark] = useState(false);
  const extensions = useMemo(() => extensionsForLanguage(language), [language]);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      setIsDark(root.classList.contains('dark'));
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-background shadow-sm">
      <CodeMirror
        value={value}
        theme={isDark ? oneDark : undefined}
        extensions={extensions}
        editable={false}
        readOnly
        basicSetup={{
          autocompletion: false,
          foldGutter: true,
          highlightActiveLine: false,
          highlightActiveLineGutter: false,
          lineNumbers: true,
        }}
        style={{ minHeight }}
      />
    </div>
  );
}
