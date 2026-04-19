import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { MarkdownCopyButton, ViewOptionsPopover } from 'fumadocs-ui/layouts/docs/page';
import type { TOCItemType } from 'fumadocs-core/toc';
import type { ApiField } from '@/components/api-explorer';
import { docsContentRoute } from '@/lib/shared';
import { componentGroups, frameworkMeta } from './shared-sdk-pages.components';
import { hookGroups } from './shared-sdk-pages.hooks';
import type { FrameworkKey, SharedKind, FrameworkMeta, SharedDoc, ReferenceTarget } from './shared-sdk-pages.types';

function detectLanguage(code: string) {
  const trimmed = code.trim();

  if (
    trimmed.startsWith('npm ') ||
    trimmed.startsWith('pnpm ') ||
    trimmed.startsWith('yarn ') ||
    trimmed.startsWith('bun ') ||
    trimmed.startsWith('cd ')
  ) {
    return 'bash';
  }

  if (
    trimmed.includes('export default function') ||
    trimmed.includes('className=') ||
    trimmed.includes('</') ||
    trimmed.includes('<')
  ) {
    return 'tsx';
  }

  return 'ts';
}

function HighlightedCode({
  code,
  lang,
}: {
  code: string;
  lang?: string;
}) {
  return (
    <DynamicCodeBlock
      lang={lang ?? detectLanguage(code)}
      code={code}
      codeblock={{
        allowCopy: true,
      }}
    />
  );
}

function HighlightedSignature({
  code,
}: {
  code: string;
}) {
  return (
    <div className="[&_pre]:my-0 [&_pre]:max-h-none [&_pre]:overflow-x-auto [&_pre]:rounded-none [&_pre]:border-0 [&_pre]:bg-transparent [&_pre]:px-0 [&_pre]:py-0 [&_pre]:text-[0.8125rem] [&_pre]:leading-6">
      <DynamicCodeBlock
        lang="ts"
        code={code}
        codeblock={{
          allowCopy: false,
        }}
      />
    </div>
  );
}

function apiFieldSignature(field: ApiField) {
  const typeLabel = field.type ?? (field.children?.length ? 'object' : 'unknown');
  const optional = field.required ? '' : '?';
  const undefinedSuffix = field.required ? '' : ' | undefined';

  return `${field.name}${optional}: ${typeLabel}${undefinedSuffix};`;
}

function toPascalCase(value: string) {
  return value
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function isExportedExample(code: string) {
  const trimmed = code.trim();

  return (
    trimmed.includes('export default function') ||
    trimmed.includes('export function') ||
    trimmed.includes('export default (') ||
    trimmed.includes('export default class')
  );
}

function collectExampleImports(code: string, refs: Record<string, ReferenceTarget>) {
  const tokens = code.match(/\b[A-Z][A-Za-z0-9]*\b/g) ?? [];
  const imports = new Set<string>();

  for (const token of tokens) {
    if (refs[token]) {
      imports.add(token);
    }
  }

  return imports;
}

function indentCode(code: string, indent: string) {
  return code
    .trim()
    .split('\n')
    .map((line) => `${indent}${line}`)
    .join('\n');
}

function formatComponentExample({
  code,
  componentName,
  exampleName,
  refs,
  importPath,
}: {
  code: string;
  componentName: string;
  exampleName: string;
  refs: Record<string, ReferenceTarget>;
  importPath: string;
}) {
  const trimmed = code.trim();

  if (isExportedExample(trimmed)) {
    return trimmed;
  }

  const imports = [...collectExampleImports(trimmed, refs)];
  if (!imports.includes(componentName)) {
    imports.unshift(componentName);
  }

  return `import { ${imports.join(', ')} } from '${importPath}';

export default function ${componentName}${exampleName}() {
  return (
    <>
${indentCode(trimmed, '      ')}
    </>
  );
}`;
}

function primaryExample(
  meta: FrameworkMeta,
  doc: SharedDoc,
  refs: Record<string, ReferenceTarget>,
): string {
  return formatComponentExample({
    code: doc.example,
    componentName: doc.importName,
    exampleName: 'Usage',
    refs,
    importPath: meta.importPath,
  });
}

export function getSharedSdkMarkdownUrl(
  framework: FrameworkKey,
  kind: SharedKind,
  slug: string,
) {
  return `${docsContentRoute}/sdks/${framework}/${kind}/${slug}/content.md`;
}

function sectionLabel(kind: SharedKind) {
  return kind === 'components' ? 'Properties' : 'Return value';
}

function headingId(value: string) {
  return value
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/<|>/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const manageAccountTabTitles = ['Profile', 'Email', 'Phone', 'Connections', 'Security', 'Sessions'];
const manageOrganizationTabTitles = ['General', 'Domains', 'Members', 'Invitations', 'Roles', 'SSO'];
const manageWorkspaceTabTitles = ['General', 'Members', 'Invitations', 'Roles'];

function buildReferenceIndex(framework: FrameworkKey): Record<string, ReferenceTarget> {
  const index: Record<string, ReferenceTarget> = {};

  for (const group of componentGroups) {
    for (const doc of group.docs) {
      index[doc.importName] = {
        href: `/docs/sdks/${framework}/components/${doc.slug}`,
        kind: 'components',
        label: `<${doc.importName} />`,
      };
    }
  }

  for (const group of hookGroups) {
    for (const doc of group.docs) {
      index[doc.importName] = {
        href: `/docs/sdks/${framework}/hooks/${doc.slug}`,
        kind: 'hooks',
        label: `${doc.importName}()`,
      };
    }
  }

  return index;
}

function renderInlineText(
  text: string,
  refs: Record<string, ReferenceTarget> = {},
  linkRefs = true,
) {
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const token = part.slice(1, -1);
      const ref = refs[token];

      if (ref && linkRefs) {
          return (
            <a
              key={index}
              href={ref.href}
            className="rounded-md border border-border bg-muted/30 px-1.5 py-0.5 text-[0.8125rem] text-foreground"
            >
              {ref.label}
            </a>
          );
      }

      return (
        <code
          key={index}
          className="rounded-md border border-border bg-muted/30 px-1.5 py-0.5 text-[0.8125rem] text-foreground"
        >
          {token}
        </code>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

function renderInlineShape(fields: ApiField[], indentLevel = 1): string {
  const indent = '  '.repeat(indentLevel);

  return fields
    .map((field) => {
      const optional = field.required ? '' : '?';

      if (field.children?.length) {
        return `${indent}${field.name}${optional}: {\n${renderInlineShape(field.children, indentLevel + 1)}\n${indent}};`;
      }

      return `${indent}${field.name}${optional}: ${field.type ?? 'unknown'};`;
    })
    .join('\n');
}

function renderInlineReference(doc: SharedDoc, kind: SharedKind): string | null {
  if (!doc.api?.length) return null;

  const name =
    kind === 'components' ? `${doc.importName}Props` : `${doc.importName}Result`;

  return `type ${name} = {\n${renderInlineShape(doc.api)}\n};`;
}

export function buildSharedSdkToc(doc: SharedDoc, kind: SharedKind): TOCItemType[] {
  const toc: TOCItemType[] = [
    { title: 'Usage', url: `#${headingId('Usage')}`, depth: 2 },
  ];

  if (doc.api?.length) {
    toc.push({ title: sectionLabel(kind), url: `#${headingId(sectionLabel(kind))}`, depth: 2 });
  }

  if (kind === 'components') {
    if (doc.sections?.length) {
      for (const section of doc.sections) {
        toc.push({ title: section.title, url: `#${headingId(section.title)}`, depth: 2 });
      }
    } else {
      if (doc.details?.length) {
        toc.push({ title: 'Behavior', url: `#${headingId('Behavior')}`, depth: 2 });
      }
      if (doc.points.length) {
        toc.push({ title: 'Notes', url: `#${headingId('Notes')}`, depth: 2 });
      }
    }
  } else {
    if (doc.sections?.length) {
      for (const section of doc.sections) {
        toc.push({ title: section.title, url: `#${headingId(section.title)}`, depth: 2 });
      }
    } else {
      if (doc.details?.length) {
        toc.push({ title: 'How it works', url: `#${headingId('How it works')}`, depth: 2 });
      }
      if (doc.points.length) {
        toc.push({ title: 'When to use it', url: `#${headingId('When to use it')}`, depth: 2 });
      }
    }
  }

  if (doc.examples?.length) {
    toc.push({ title: 'Examples', url: `#${headingId('Examples')}`, depth: 2 });
  }

  return toc;
}

function renderMarkdownLines(lines: string[]) {
  return lines.map((line) => `${line}\n`).join('\n');
}

export function buildSharedSdkMarkdown({
  doc,
  framework,
  kind,
}: {
  doc: SharedDoc;
  framework: FrameworkKey;
  kind: SharedKind;
}) {
  const meta = frameworkMeta[framework];
  const blocks: string[] = [];
  const refs = buildReferenceIndex(framework);

  blocks.push(`# ${kind === 'components' ? `<${doc.importName} />` : `${doc.importName}()`} ${kind === 'components' ? 'component' : 'hook'}`);
  blocks.push('');
  blocks.push(doc.description);
  blocks.push('');
  blocks.push(doc.intro);
  blocks.push('');
  blocks.push('## Usage');
  blocks.push('');
  blocks.push('```tsx');
  blocks.push(primaryExample(meta, doc, refs));
  blocks.push('```');

  if (doc.api?.length) {
    blocks.push('');
    blocks.push(`## ${sectionLabel(kind)}`);
    blocks.push('');
    for (const field of doc.api) {
      blocks.push(`- **${field.name}** ${field.type ? `\`${field.type}\`` : ''}${field.required ? ' (required)' : ''}`);
      if (field.description) {
        blocks.push(`  - ${field.description}`);
      }
      if (field.children?.length) {
        for (const child of field.children) {
          blocks.push(`  - **${field.name}.${child.name}** ${child.type ? `\`${child.type}\`` : ''}${child.required ? ' (required)' : ''}`);
          if (child.description) {
            blocks.push(`    - ${child.description}`);
          }
        }
      }
    }
  }

  if (kind === 'components') {
    if (doc.sections?.length) {
      for (const section of doc.sections) {
        blocks.push('');
        blocks.push(`## ${section.title}`);
        blocks.push('');
        if (section.paragraphs?.length) {
          blocks.push(renderMarkdownLines(section.paragraphs));
          blocks.push('');
        }
        if (section.points?.length) {
          blocks.push(...section.points.map((point) => `- ${point}`));
          blocks.push('');
        }
      }
    } else {
      if (doc.details?.length) {
        blocks.push('');
        blocks.push('## Behavior');
        blocks.push('');
        blocks.push(renderMarkdownLines(doc.details));
      }
      if (doc.points.length) {
        blocks.push('');
        blocks.push('## Notes');
        blocks.push('');
        blocks.push(...doc.points.map((point) => `- ${point}`));
      }
    }
  } else {
    if (doc.sections?.length) {
      for (const section of doc.sections) {
        blocks.push('');
        blocks.push(`## ${section.title}`);
        blocks.push('');
        if (section.paragraphs?.length) {
          blocks.push(renderMarkdownLines(section.paragraphs));
          blocks.push('');
        }
        if (section.points?.length) {
          blocks.push(...section.points.map((point) => `- ${point}`));
          blocks.push('');
        }
      }
    } else {
      if (doc.details?.length) {
        blocks.push('');
        blocks.push('## How it works');
        blocks.push('');
        blocks.push(renderMarkdownLines(doc.details));
      }
      if (doc.points.length) {
        blocks.push('');
        blocks.push('## When to use it');
        blocks.push('');
        blocks.push(...doc.points.map((point) => `- ${point}`));
      }
    }
  }

  if (doc.examples?.length) {
    blocks.push('');
    blocks.push('## Examples');
    blocks.push('');
    for (const example of doc.examples) {
      blocks.push(`### ${example.title}`);
      blocks.push('');
      blocks.push('```' + (example.lang ?? 'tsx'));
      blocks.push(
        kind === 'components'
          ? formatComponentExample({
              code: example.code,
              componentName: doc.importName,
              exampleName: toPascalCase(example.title),
              refs,
              importPath: meta.importPath,
            })
          : example.code,
      );
      blocks.push('```');
      blocks.push('');
    }
  }

  return blocks.join('\n').trim() + '\n';
}

export const sharedComponentCatalog = componentGroups;
export const sharedHookCatalog = hookGroups;

export function getSharedSdkDoc(
  framework: FrameworkKey,
  kind: SharedKind,
  slug: string,
) {
  const catalog = kind === 'components' ? componentGroups : hookGroups;
  const group = catalog.find((entry) => entry.docs.some((doc) => doc.slug === slug));
  const doc = group?.docs.find((entry) => entry.slug === slug);

  if (!doc) return null;

  return {
    framework,
    kind,
    group: group!.label,
    ...doc,
  };
}

export function getSharedSdkDocParams() {
  const frameworks: FrameworkKey[] = ['nextjs', 'react-router', 'tanstack-router'];
  const params: Array<{ slug: string[] }> = [];

  for (const framework of frameworks) {
    for (const group of componentGroups) {
      for (const doc of group.docs) {
        params.push({ slug: ['sdks', framework, 'components', doc.slug] });
      }
    }

    for (const group of hookGroups) {
      for (const doc of group.docs) {
        params.push({ slug: ['sdks', framework, 'hooks', doc.slug] });
      }
    }
  }

  return params;
}

export function SharedSdkDocPage({
  framework,
  kind,
  slug,
  markdownUrl,
}: {
  framework: FrameworkKey;
  kind: SharedKind;
  slug: string;
  markdownUrl?: string;
}) {
  const doc = getSharedSdkDoc(framework, kind, slug);

  if (!doc) {
    throw new Error(`Unknown shared SDK doc: ${framework}/${kind}/${slug}`);
  }

  const meta = frameworkMeta[framework];
  const refs = buildReferenceIndex(framework);
  const sections = doc.sections ?? [];

  return (
    <div className="space-y-8">
      <h1 className="text-[1.5rem] font-normal leading-tight text-foreground">
        {kind === 'components' ? (
          <>
            <code className="rounded-md border border-border bg-muted/30 px-1.5 py-0.5 text-[1.5rem] text-foreground">
              &lt;{doc.importName} /&gt;
            </code>{' '}
            component
          </>
        ) : (
          <>
            <code className="rounded-md border border-border bg-muted/30 px-1.5 py-0.5 text-[1.5rem] text-foreground">
              {doc.importName}()
            </code>{' '}
            hook
          </>
        )}
      </h1>

      <div className="space-y-3">
        <div className="text-sm leading-7 text-muted-foreground">
          {renderInlineText(doc.intro, refs)}
        </div>
      </div>

      {markdownUrl ? (
        <div className="flex flex-wrap items-center gap-2">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover markdownUrl={markdownUrl} />
        </div>
      ) : null}

      <section className="space-y-3">
        <h2 id={headingId('Usage')} className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">
          Usage
        </h2>
        <p>
          The following example shows a basic usage of{' '}
          <code>{kind === 'components' ? `<${doc.importName} />` : `${doc.importName}()`}</code>.
        </p>
        <HighlightedCode code={primaryExample(meta, doc, refs)} />
      </section>

      {doc.api?.length ? (
        <section id="properties" className="space-y-3">
          <h2 id={headingId(sectionLabel(kind))} className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">
            {sectionLabel(kind)}
          </h2>
          <p>
            {kind === 'components'
              ? 'All properties are optional unless otherwise noted.'
              : 'The hook returns the following fields and methods.'}
          </p>
          <div className="divide-y divide-border border-y border-border">
            {doc.api.map((field) => (
              <ApiProperty key={field.name} field={field} />
            ))}
          </div>
        </section>
      ) : null}

      {kind === 'components' ? (
        <>
          {sections.length ? (
            <>
              {sections.map((section) => {
                if (
                  doc.importName === 'ManageAccount' &&
                  manageAccountTabTitles.includes(section.title)
                ) {
                  return null;
                }

                if (
                  doc.importName === 'ManageOrganization' &&
                  manageOrganizationTabTitles.includes(section.title)
                ) {
                  return null;
                }

                if (
                  doc.importName === 'ManageWorkspace' &&
                  manageWorkspaceTabTitles.includes(section.title)
                ) {
                  return null;
                }

                const isManageAccountBehavior =
                  doc.importName === 'ManageAccount' && section.title === 'Behavior';

                return (
                  <section key={section.title} className="space-y-3">
                    <h2 id={headingId(section.title)} className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">
                      {section.title}
                    </h2>
                    {section.paragraphs?.length ? (
                      <div className="space-y-2">
                        {section.paragraphs.map((paragraph) => (
                          <div key={paragraph} className="text-sm leading-7 text-muted-foreground">
                            {renderInlineText(paragraph, refs)}
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {section.points?.length ? (
                      <ul className="space-y-1.5 text-sm leading-7 text-muted-foreground">
                        {section.points.map((point) => (
                          <li key={point} className="leading-7">
                            {renderInlineText(point, refs)}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {isManageAccountBehavior ||
                    (doc.importName === 'ManageOrganization' && section.title === 'Behavior') ||
                    (doc.importName === 'ManageWorkspace' && section.title === 'Behavior') ? (
                      <section className="space-y-3 pt-2">
                        <h2 id={headingId('Tabs')} className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">
                          Tabs
                        </h2>
                        <table className="w-full border-collapse text-left text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="pb-3 pr-4 font-medium text-foreground">Tab</th>
                              <th className="pb-3 font-medium text-foreground">What it covers</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sections
                              .filter((entry) =>
                                doc.importName === 'ManageOrganization'
                                  ? manageOrganizationTabTitles.includes(entry.title)
                                  : doc.importName === 'ManageWorkspace'
                                    ? manageWorkspaceTabTitles.includes(entry.title)
                                  : manageAccountTabTitles.includes(entry.title),
                              )
                              .map((entry) => {
                                return (
                                  <tr key={entry.title} className="border-b border-border last:border-b-0">
                                    <td className="py-4 pr-4 align-top font-medium text-foreground">
                                      <a href={`#${headingId(entry.title)}`} className="text-foreground">
                                        {entry.title}
                                      </a>
                                    </td>
                                    <td className="py-4 align-top leading-7 text-muted-foreground">
                                      <div className="space-y-2">
                                        {entry.paragraphs?.map((paragraph) => (
                                          <div key={paragraph} className="leading-7">
                                            {renderInlineText(paragraph, refs, false)}
                                          </div>
                                        ))}
                                        {entry.points?.length ? (
                                          <ul className="space-y-1.5 pl-4">
                                            {entry.points.map((point) => (
                                              <li key={point} className="list-disc leading-7">
                                                {renderInlineText(point, refs, false)}
                                              </li>
                                            ))}
                                          </ul>
                                        ) : null}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </section>
                    ) : null}
                  </section>
                );
              })}
            </>
          ) : (
            <>
              {doc.details?.length ? (
                <section className="space-y-3">
                  <h2 id={headingId('Behavior')} className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">
                    Behavior
                  </h2>
                  <div className="space-y-2">
                    {doc.details.map((point) => (
                      <div key={point} className="text-sm leading-7 text-muted-foreground">
                        {renderInlineText(point, refs)}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {doc.points.length ? (
                <section className="space-y-3">
                  <h2 id={headingId('Notes')} className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">
                    Notes
                  </h2>
                  <ul className="space-y-1.5 text-sm leading-7 text-muted-foreground">
                    {doc.points.map((point) => (
                      <li key={point} className="leading-7">
                        {renderInlineText(point, refs)}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </>
          )}
        </>
      ) : (
        <>
          {sections.length ? (
            <>
              {sections.map((section) => (
                <section key={section.title} className="space-y-3">
                  <h2 id={headingId(section.title)} className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">
                    {section.title}
                  </h2>
                  {section.paragraphs?.length ? (
                    <div className="space-y-2">
                      {section.paragraphs.map((paragraph) => (
                        <div key={paragraph} className="text-sm leading-7 text-muted-foreground">
                          {renderInlineText(paragraph, refs)}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {section.points?.length ? (
                    <ul className="space-y-1.5 text-sm leading-7 text-muted-foreground">
                      {section.points.map((point) => (
                        <li key={point} className="leading-7">
                          {renderInlineText(point, refs)}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </>
          ) : (
            <>
              {doc.details?.length ? (
                  <section className="space-y-3">
                  <h2 id={headingId('How it works')} className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">
                    How it works
                  </h2>
                  <div className="space-y-2">
                    {doc.details.map((point) => (
                      <div key={point} className="text-sm leading-7 text-muted-foreground">
                        {renderInlineText(point, refs)}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="space-y-3">
                <h2 id={headingId('When to use it')} className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">
                  When to use it
                </h2>
                <ul className="space-y-1.5 text-sm leading-7 text-muted-foreground">
                  {doc.points.map((point) => (
                    <li key={point} className="leading-7">
                      {renderInlineText(point, refs)}
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </>
      )}

      {doc.examples?.length ? (
        <section className="space-y-3">
          <h2 id={headingId('Examples')} className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">
            Examples
          </h2>
          <div className="space-y-5">
            {doc.examples.map((example) => (
              <div key={example.title} className="space-y-2">
                <h3 className="text-base font-medium text-foreground">{example.title}</h3>
                <HighlightedCode
                  code={
                    kind === 'components'
                      ? formatComponentExample({
                          code: example.code,
                          componentName: doc.importName,
                          exampleName: toPascalCase(example.title),
                          refs,
                          importPath: meta.importPath,
                        })
                      : example.code
                  }
                  lang={example.lang}
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export function SharedComponentsPage({
  framework,
  page,
}: {
  framework: FrameworkKey;
  page: string;
}) {
  return (
    <SharedSdkDocPage
      framework={framework}
      kind="components"
      slug={page}
      markdownUrl={getSharedSdkMarkdownUrl(framework, 'components', page)}
    />
  );
}

export function SharedHooksPage({
  framework,
  page,
}: {
  framework: FrameworkKey;
  page: string;
}) {
  return (
    <SharedSdkDocPage
      framework={framework}
      kind="hooks"
      slug={page}
      markdownUrl={getSharedSdkMarkdownUrl(framework, 'hooks', page)}
    />
  );
}

function ApiProperty({
  field,
  depth = 0,
}: {
  field: ApiField;
  depth?: number;
}) {
  const signature = apiFieldSignature(field);

  return (
    <details className="group py-4" style={{ paddingLeft: depth ? `${depth * 20}px` : undefined }}>
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <div className="flex items-center gap-2">
          <span className="flex shrink-0 items-center self-center text-muted-foreground transition-transform group-open:rotate-90">
            ›
          </span>
          <div className="min-w-0 flex-1 rounded-md bg-muted/20 px-3 py-2">
            <HighlightedSignature code={signature} />
          </div>
        </div>
      </summary>

      <div className="space-y-3 pt-3 pl-7">
        <div className="text-sm leading-7 text-muted-foreground">{field.description}</div>

        {field.children?.length ? (
          <div className="divide-y divide-border border-l border-border/70 pl-4">
            {field.children.map((child) => (
              <ApiProperty
                key={`${field.name}.${child.name}`}
                field={child}
                depth={depth + 1}
              />
            ))}
          </div>
        ) : null}
      </div>
    </details>
  );
}
