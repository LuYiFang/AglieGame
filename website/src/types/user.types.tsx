import { SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

export type actionType = "block" | "item";
export type direction = "up" | "down";

export interface BlockType {
  sx?: SxProps | ((theme: Theme) => SxProps);
  children: ReactNode;
  settable?: boolean;
  direction?: direction;
  [key: string]: any;
}

export interface ItemType {
  name: string;
  settable: boolean;
}
