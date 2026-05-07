export interface Route {
  method: string; // GET, POST, PUT, PATCH, DELETE
  path: string;   // OpenAPI format: /users/{user_id}
  handlerFn: string;
  tag: string;
  rawPath: string; // original before conversion
}

export interface GoHandlerInfo {
  validateType?: string;      // handler.Validate[TypeName](c)
  bindBodyFields?: GoField[];  // c.Bind().Body(&struct{})
  formFields?: GoField[];      // c.FormValue("key") / c.FormFile("key")
  queryParams?: string[];      // c.Query("key")
  pathParams?: string[];       // c.Params("key")
  hasFileUpload?: boolean;
  hasMultipart?: boolean;
  schemaTypes?: GoSchemaType[];
  responseType?: string;       // named type from SendSuccess(c, TypeName{})
  responseSchema?: JsonSchema; // inline schema from SendSuccess(c, fiber.Map{})
  rawJsonResponse?: boolean;   // uses c.JSON() directly — no SendSuccess envelope
}

export interface GoSchemaType {
  name: string;
  fields: GoField[];
}

export interface GoField {
  name: string;       // Go field name
  jsonKey: string;    // from json/form tag
  goType: string;     // Go type string
  required: boolean;
  optional: boolean;
}

export interface RustHandlerInfo {
  jsonBodyType?: string;
  queryParamsType?: string;
  pathParamsType?: string;
  hasMultipart?: boolean;
  responseType?: string;
}

export interface RustStructField {
  name: string;       // Rust field name (snake_case)
  rustType: string;
  required: boolean;  // false if wrapped in Option<>
  serdeRename?: string;
  serializedAsString?: boolean;
}

export interface RustStruct {
  name: string;
  fields: RustStructField[];
  enumVariants?: string[];
  isEnum?: boolean;
}

export type JsonSchema = {
  type?: string | string[];
  format?: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
  enum?: unknown[];
  const?: unknown;
  $ref?: string;
  description?: string;
  additionalProperties?: JsonSchema | boolean;
  oneOf?: JsonSchema[];
  anyOf?: JsonSchema[];
  nullable?: boolean;
};

export type SecurityScheme =
  | { type: 'http'; scheme: string; description?: string }
  | { type: 'apiKey'; in: 'header' | 'cookie' | 'query'; name: string; description?: string };

export type OpenAPISpec = {
  openapi: '3.1.0';
  info: { title: string; version: string; description: string };
  servers: { url: string; description?: string }[];
  tags: { name: string }[];
  security?: Record<string, string[]>[];
  paths: Record<string, Record<string, OperationObject>>;
  components: {
    schemas: Record<string, JsonSchema>;
    securitySchemes?: Record<string, SecurityScheme>;
  };
};

export type OperationObject = {
  operationId: string;
  summary: string;
  description?: string;
  tags: string[];
  parameters?: ParameterObject[];
  requestBody?: RequestBodyObject;
  responses: Record<string, ResponseObject>;
  security?: Record<string, string[]>[];
};

export type ParameterObject = {
  name: string;
  in: 'path' | 'query' | 'header';
  required: boolean;
  schema: JsonSchema;
  description?: string;
};

export type RequestBodyObject = {
  required: boolean;
  content: Record<string, { schema: JsonSchema }>;
};

export type ResponseObject = {
  description: string;
  content?: Record<string, { schema: JsonSchema }>;
};
