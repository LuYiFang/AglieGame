import { SxProps, Theme } from "@mui/material";
import { iteratee } from "lodash";
import { ReactNode } from "react";

export type actionType = "block" | "item";
export type direction = "up" | "down";

export interface BlockType {
  title?: string;
  sx?: SxProps | ((theme: Theme) => SxProps);
  children: ReactNode;
  settable?: boolean;
  direction?: direction;
  onAdd?: (...args: any[]) => void;
  onSave?: (...args: any[]) => void;
  [key: string]: any;
}

export interface ItemType {
  name?: string;
  settable?: boolean;
}

export interface abilityListType {
  id: string;
  name: string;
  value: number | string;
  subType: string;
}

// export interface abilityListType {
//   [key: string]: abilityListType[];
// }

export interface UserItemType {
  name: string;
  score: number | string;
  onDelete: (...args: any[]) => void;
  onUpdate: (...args: any[]) => void;
}

export interface SubTypeType {
  id: string;
  name: string;
  type: string;
}
