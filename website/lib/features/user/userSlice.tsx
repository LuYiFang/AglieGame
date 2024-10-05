import { abilityListType } from "@/types/user.types";
import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "@reduxjs/toolkit/query";
import * as _ from "lodash";

type InitialStateType = {
  data: abilityListType;
};

// export const userAdapter = createEntityAdapter<abilityListType>();
export const userAdapter = createEntityAdapter({
  selectId: (item: abilityListType) => item.id,
});

const initialState = userAdapter.getInitialState({
  data: [],
});

const createGenericSlice = (name: string) => {
  return createSlice({
    name,
    initialState,
    reducers: {
      addItem: userAdapter.addOne,
      removeItem: userAdapter.removeOne,
      updateItem: userAdapter.updateOne,
      upsertItem: userAdapter.upsertOne,
      setAll: userAdapter.setAll,
    },
  });
};

export const skillSlice = createGenericSlice("skills");
export const skillAction = skillSlice.actions;
export const skillReducer = skillSlice.reducer;

export const eqpSlice = createGenericSlice("eqps");
export const eqpAction = eqpSlice.actions;
export const eqpReducer = eqpSlice.reducer;

export const qualitySlice = createGenericSlice("qualities");
export const qualityAction = qualitySlice.actions;
export const qualityReducer = qualitySlice.reducer;

export const personalitySlice = createGenericSlice("personalities");
export const personalityAction = personalitySlice.actions;
export const personalityReducer = personalitySlice.reducer;

export type ReducerActions =
  | typeof skillAction
  | typeof eqpAction
  | typeof qualityAction
  | typeof personalityAction;
