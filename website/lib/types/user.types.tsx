import { SxProps, Theme } from "@mui/material";
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
  img?: string;
  level?: string;
  [key: string]: any;
}

export interface UserItemType {
  data: abilityListType;
  onDelete: (...args: any[]) => void;
  onUpdate: (...args: any[]) => void;
}

export interface SubTypeType {
  id: string;
  name: string;
  type: string;
}
