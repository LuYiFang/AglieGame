import { abilityListType } from "@/types/user.types";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import * as _ from "lodash";
import { v4 as uuidv4 } from "uuid";

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
      addItem: (state, update) => {
        const newData = {
          id: uuidv4(),
          name: "",
          value: "",
          subType: update.payload,
        };
        userAdapter.addOne(state, newData);
      },
      removeItem: userAdapter.removeOne,
      updateItem: (state, update) => {
        const { id, updateData, valueList } = update.payload;

        if (_.keys(updateData) <= 0) return;

        const item = _.find(valueList, { id: id });
        if (!item) throw new Error("Item not found");

        userAdapter.updateOne(state, {
          id: item.id,
          changes: _.assign({}, item, updateData),
        });
      },
      saveSubType: (state, update) => {
        const { subTypeList, typeList, valueList } = update.payload;
        const deleteItems = _.differenceBy(subTypeList, typeList, "id");
        const updateItems = _.intersectionWith(
          typeList,
          subTypeList,
          (arrVal, othVal) =>
            arrVal.id === othVal.id && arrVal.name !== othVal.name,
        );
        const addItems = _.differenceBy(typeList, subTypeList, "id");

        const newValueList = [...valueList];
        const oriSubTypes = _.groupBy(subTypeList, "id");

        _.each(valueList, (v, i) => {
          _.each(deleteItems, (d) => {
            if (v.subType !== d.name) return;
            if (v.name) {
              console.log(`Cannot delete non-empty subtype ${d.name}`);
              return;
            }
            newValueList.splice(i, 1);
          });

          _.each(updateItems, (u) => {
            if (v.subType !== oriSubTypes[u.id].name) return;
            newValueList[i].subType = u.name;
          });
        });

        _.each(addItems, (v) => {
          newValueList.push({
            id: uuidv4(),
            name: "",
            value: "",
            subType: v.name,
          });
        });

        userAdapter.setAll(state, newValueList);
      },
      upsertItem: userAdapter.upsertOne,
      setAll: userAdapter.setAll,
    },
  });
};

const slices = {};
const actions = {};
const reducers = {};
const getValues = (name: string) => {
  const slice = createGenericSlice(name);
  slices[`${name}`] = slice;
  actions[`${name}`] = slice.actions;
  reducers[`${name}`] = slice.reducer;
};

export const sliceNameList = [
  "skill",
  "skillProper",
  "eqp",
  "eqpProper",
  "quality",
  "qualityProper",
  "personality",
  "polarProper",
  "portrait",
];

_.each(sliceNameList, (name) => {
  getValues(name);
});

const actionType = _.values(actions) as const;
export type ReducerActions = (typeof actionType)[number];
export { slices, actions, reducers };
