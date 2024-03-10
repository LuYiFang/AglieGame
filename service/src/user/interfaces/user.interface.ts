export interface User {
  username: string;
  password: string;
}

export type userProperties = Array<string>;

export interface FindUser {
  username: string;
  properties: userProperties;
}
