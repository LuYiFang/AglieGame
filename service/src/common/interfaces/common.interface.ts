export type Neo4jExtractMany = Promise<Record<string, any>>;
export type Neo4jExtractSingle = Promise<{ [key: string]: any } | null>;
export interface Porperties {
  [key: string]: any;
}
export interface ProjectUserPermission {
  projectId: string;
  username: string;
  permissions: Array<string>;
}
