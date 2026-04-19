import { Project, SyntaxKind, type InterfaceDeclaration, type TypeAliasDeclaration } from 'ts-morph';
import type { JsonSchema } from './types.js';

export function parseTypeScriptSchemas(typesDir: string): Map<string, JsonSchema> {
  const project = new Project({ skipAddingFilesFromTsConfig: true });
  project.addSourceFilesAtPaths(`${typesDir}/**/*.ts`);

  const schemas = new Map<string, JsonSchema>();

  for (const sourceFile of project.getSourceFiles()) {
    // Parse interfaces
    for (const iface of sourceFile.getInterfaces()) {
      const schema = interfaceToSchema(iface, schemas);
      schemas.set(iface.getName(), schema);
    }

    // Parse type aliases
    for (const typeAlias of sourceFile.getTypeAliases()) {
      const schema = typeAliasToSchema(typeAlias, schemas);
      if (schema) {
        schemas.set(typeAlias.getName(), schema);
      }
    }
  }

  return schemas;
}

function interfaceToSchema(
  iface: InterfaceDeclaration,
  _schemas: Map<string, JsonSchema>,
): JsonSchema {
  const properties: Record<string, JsonSchema> = {};
  const required: string[] = [];

  for (const prop of iface.getProperties()) {
    const name = prop.getName();
    const isOptional = prop.hasQuestionToken();
    const typeNode = prop.getTypeNode();
    const schema = typeNode ? typeNodeToSchema(typeNode.getText(), prop.getType().getText()) : {};

    properties[name] = schema;
    if (!isOptional) required.push(name);
  }

  return {
    type: 'object',
    properties,
    ...(required.length > 0 ? { required } : {}),
  };
}

function typeAliasToSchema(
  alias: TypeAliasDeclaration,
  _schemas: Map<string, JsonSchema>,
): JsonSchema | null {
  const typeText = alias.getType().getText();
  const node = alias.getTypeNode();
  if (!node) return null;

  const nodeKind = node.getKind();

  // Union type like "a" | "b" | "c" → enum
  if (nodeKind === SyntaxKind.UnionType) {
    const unionNode = node.asKind(SyntaxKind.UnionType)!;
    const types = unionNode.getTypeNodes();
    const allLiterals = types.every(t =>
      t.getKind() === SyntaxKind.LiteralType
    );

    if (allLiterals) {
      const values = types.map(t => {
        const text = t.getText();
        return text.replace(/^["']|["']$/g, '');
      });
      return { type: 'string', enum: values };
    }

    // Mixed union types → oneOf
    return {
      oneOf: types.map(t => typeNodeToSchema(t.getText(), t.getText())),
    };
  }

  return typeNodeToSchema(node.getText(), typeText);
}

export function typeNodeToSchema(nodeText: string, typeText: string): JsonSchema {
  // Strip any leading pipe/ampersand that ts-morph may include for multi-line unions
  const t = nodeText.trim().replace(/^[|&]\s*/, '');

  // Primitives
  if (t === 'string') return { type: 'string' };
  if (t === 'number') return { type: 'number' };
  if (t === 'boolean') return { type: 'boolean' };
  if (t === 'null') return { type: 'null' as any };
  if (t === 'undefined') return { nullable: true };
  if (t === 'unknown' || t === 'any') return {};

  // Date
  if (t === 'Date') return { type: 'string', format: 'date-time' };

  // String literal
  if (/^["']/.test(t)) return { type: 'string', enum: [t.replace(/^["']|["']$/g, '')] };

  // Number literal
  if (/^\d+$/.test(t)) return { type: 'integer', enum: [parseInt(t)] };

  // Array types: T[] or Array<T>
  if (t.endsWith('[]')) {
    return { type: 'array', items: typeNodeToSchema(t.slice(0, -2), t.slice(0, -2)) };
  }
  if (t.startsWith('Array<') && t.endsWith('>')) {
    return { type: 'array', items: typeNodeToSchema(t.slice(6, -1), t.slice(6, -1)) };
  }

  // Record<K, V>
  if (t.startsWith('Record<')) {
    const inner = t.slice(7, -1);
    const commaIdx = inner.indexOf(',');
    const valueType = inner.slice(commaIdx + 1).trim();
    return { type: 'object', additionalProperties: typeNodeToSchema(valueType, valueType) };
  }

  // T | null  or  T | undefined
  if (t.includes(' | null') || t.includes(' | undefined')) {
    const base = t.replace(/\s*\|\s*null/g, '').replace(/\s*\|\s*undefined/g, '').trim();
    const baseSchema = typeNodeToSchema(base, base);
    return { ...baseSchema, nullable: true };
  }

  // Union type: "a" | "b"
  if (t.includes(' | ')) {
    const parts = t.split(' | ').map(p => p.trim());
    const allStringLiterals = parts.every(p => /^["']/.test(p));
    if (allStringLiterals) {
      return { type: 'string', enum: parts.map(p => p.replace(/^["']|["']$/g, '')) };
    }
    return { oneOf: parts.map(p => typeNodeToSchema(p, p)) };
  }

  // Inline object literal (from typeText)
  if (t.startsWith('{') && t.endsWith('}')) {
    return { type: 'object' };
  }

  // Reference to another type
  return { $ref: `#/components/schemas/${t}` };
}
