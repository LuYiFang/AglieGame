export type Neo4jExtractMany = Promise<Record<string, any>>;
export type Neo4jExtractSingle = Promise<{ [key: string]: any } | null>;
