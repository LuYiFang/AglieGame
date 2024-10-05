"use client";
import React, {
  useEffect,
  FC,
  useState,
  ReactElement,
  useMemo,
} from "react";
import { Box, Theme, Button } from "@mui/material";
import * as _ from "lodash";
import SettingButton from "../components/button/SettingButton";
import RadarChart from "../components/chart/RadarChart";
import SkillCircular from "../components/Circular/SkillCircular";
import { Equipment, Quality } from "../components/item/userItem";
import Grid from "@mui/material/Grid2";
// import Grid from "../components/block/Grid";
import LevelCircle from "../components/Circular/LevelCircle";
import {
  AreaBlock,
  ScrollXBlock,
  SubTypeBlock,
} from "../components/block/UserBlock";
import TextField from "../components/input/TextField";
import AddIcon from "@mui/icons-material/Add";
import { SifiAddButton, SiFiIconButton } from "../components/item/SifiItem";
import ClearIcon from "@mui/icons-material/Clear";
import { v4 as uuidv4 } from "uuid";
import {
  eqpAction,
  personalityAction,
  qualityAction,
  ReducerActions,
  skillAction,
} from "@/lib/features/user/userSlice";
import { selectAllEqps, selectAllQuality, selectAllSkills } from "@/lib/store";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { eqpList, personality, polarData, qualityList, skillList } from "@/lib/utilities/fakeData";
import { abilityListType, SubTypeType, UserItemType } from "@/lib/types/user.types";

const skillHeight = 200;

export default function UserPage() {
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    dispatch(eqpAction.setAll(_.map(eqpList, (v) => ({ ...v, id: uuidv4() }))));
    dispatch(
      skillAction.setAll(_.map(skillList, (v) => ({ ...v, id: uuidv4() }))),
    );
    dispatch(
      qualityAction.setAll(_.map(qualityList, (v) => ({ ...v, id: uuidv4() }))),
    );
    dispatch(
      personalityAction.setAll(
        _.map(personality, (v) => ({ ...v, id: uuidv4() })),
      ),
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 32px)",
        backgroundColor: "white",
      }}
    >
      <Box
        sx={(theme) => ({
          height: "100%",
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          [theme.breakpoints.down("md")]: {
            display: "block",
          },
        })}
      >
        <Grid
          container
          size={12}
          sx={{ flex: 2, maxHeight: `calc(100% - ${skillHeight}px)` }}
        >
          <EditBlock
            areaParams={{
              container: true,
              size: { md: 3 },
              sx: { zIndex: 1 },
            }}
            subParams={{
              container: true,
              // xs: 12,
              direction: "up",
              sx: { flexDirection: "column", width: "100%" },
            }}
            action={eqpAction}
            selectAll={selectAllEqps}
          >
            <Equipment />
          </EditBlock>
          <AreaBlock
            size={{ xs: 12, md: 6 }}
            settable
            direction="down"
            sx={{ backgroundColor: "#FBFBFB", overflowX: "hidden" }}
          >
            <Box
              sx={(theme) => ({
                backgroundColor: "transparent",
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 0,
                [theme.breakpoints.down("md")]: {
                  height: 500,
                },
              })}
            >
              <img
                src="/charactar3.jpg"
                style={{
                  zIndex: 0,
                  maxHeight: `calc(100vh - ${skillHeight + 32}px)`,
                  // height: "100vh",
                }}
              />
            </Box>
            <EditTags defaultTagList={personality} />
            <Box
              sx={{
                position: "absolute",
                top: 24,
                right: 0,
                width: 200,
                height: 200,
                backgroundColor: "transparent",
              }}
            >
              <SettingButton settable data={[]} />
              <RadarChart data={polarData} />
            </Box>
          </AreaBlock>
          <EditBlock
            areaParams={{
              container: true,
              size: { md: 3 },
            }}
            subParams={{
              sx: {
                flexDirection: "column",
                width: "100%",
              },
              direction: "up",
            }}
            action={qualityAction}
            selectAll={selectAllQuality}
          >
            <Quality />
          </EditBlock>
        </Grid>
        <Grid
          container
          size={12}
          sx={(theme) => ({
            minHeight: skillHeight,
            maxHeight: skillHeight,
            [theme.breakpoints.down("md")]: {
              maxHeight: 50,
            },
            flex: 1,
          })}
        >
          <AreaBlock
            size={{ xs: 12, md: 1 }}
            sx={(theme: Theme) => ({
              maxWidth: 230,
              [theme.breakpoints.down("md")]: {
                maxWidth: "100vw",
              },
            })}
          >
            <LevelCircle />
          </AreaBlock>
          <EditBlock
            areaParams={{
              size: { md: 11 },
              onWheel: (e: WheelEvent) => {
                const container = e.currentTarget as HTMLDivElement;
                container.scrollLeft += e.deltaY;
              },
              sx: {
                pt: 0,
                overflowX: "auto",
                overflowY: "hidden",
                width: "100%",
                display: "flex",
              },
            }}
            subParams={{
              sx: {
                width: "fit-content",
                alignItems: "center",
                flexShrink: 0,
                pt: 1,
                mr: 1,
              },
              direction: "down",
            }}
            action={skillAction}
            selectAll={selectAllSkills}
          >
            <SkillCircular />
          </EditBlock>
        </Grid>
      </Box>
    </div>
  );
}

const EditBlock: FC<{
  areaParams: { [key: string]: any };
  subParams: { [key: string]: any };
  children: ReactElement<UserItemType>;
  action?: ReducerActions;
  selectAll?: (...args: any[]) => any;
}> = ({ areaParams, subParams, children, action, selectAll = () => {} }) => {
  const dispatch = useAppDispatch();

  const [valueList, setValueList] = useState<abilityListType[]>([]);
  const [subTypeList, setSubTypeList] = useState<SubTypeType[]>([]);

  const storeValueList = useAppSelector(selectAll);

  const subTypeGroup = useMemo(() => {
    return _.groupBy(valueList, "subType");
  }, [valueList]);

  useEffect(() => {
    console.log("valueList update",storeValueList);
    if (!storeValueList) return;
    if (storeValueList.length > 0) {
      setValueList(storeValueList)
      return
    }
    
    if (!action) return;

    const id = uuidv4();
    const newData = [{ id: id, name: "", value: "", subType: "" }];
    dispatch(action.setAll(newData));
    setValueList(storeValueList);
  }, [storeValueList]);

  useEffect(() => {
    if (!subTypeGroup) return;

    setSubTypeList(
      _.map(_.keys(subTypeGroup), (v) => ({
        id: uuidv4(),
        name: v,
        type: "subType",
      })),
    );
  }, [subTypeGroup]);

  const handleAddItem = (type: string) => {
    if (!action) return;

    const newData = { id: uuidv4(), name: "", value: "", subType: type };

    setValueList([...valueList, newData]);
    dispatch(action.addItem(newData));
  };

  const handleUpdateItem = (
    id: string,
    property: string | null,
    value: number | string | null,
  ) => {
    if (!action) return;
    if (property === null && value === null) {
      return;
    }

    const targetIndex = _.findIndex(valueList, { id: id });
    const newItem = {
      ...valueList[targetIndex],
    };

    if (value === null && property !== null) {
      newItem["name"] = property;
    }

    if (property === null && value !== null) {
      newItem["value"] = value;
    }

    const newValueList = [...valueList];
    newValueList.splice(targetIndex, 1, newItem);
    setValueList(newValueList);
    dispatch(action.updateItem({ id: newItem.id, changes: newItem }));
  };

  const handleDeleteItem = (id: string) => {
    if (!action) return;

    const targetIndex = _.findIndex(valueList, { id: id });
    const newValueList = [...valueList];
    newValueList.splice(targetIndex, 1);
    setValueList(newValueList);
    dispatch(action.removeItem(id));
  };

  const handleSaveSubType = ({ typeList, propertyList }) => {
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
      newValueList.push({ id: uuidv4(), name: "", value: "", subType: v.name });
    });

    if (!action) return;

    setValueList(newValueList);
    dispatch(action.setAll(newValueList));

    // properties part
  };

  return (
    <>
      <AreaBlock
        settable
        direction="down"
        size={12}
        {...areaParams}
        data={subTypeList}
        onSave={handleSaveSubType}
      >
        {_.map(subTypeGroup, (subType, type) => (
          <SubTypeBlock
            title={type}
            key={`${type}`}
            settable
            onAdd={() => handleAddItem(type)}
            {...subParams}
          >
            {_.map(subType, (item: abilityListType, i: number) => {
              return React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child, {
                    key: `${item.name}`,
                    name: item.name,
                    score: item.value,
                    onUpdate: (
                      name: string | null,
                      score: string | number | null,
                    ) => handleUpdateItem(item.id, name, score),
                    onDelete: () => handleDeleteItem(item.id),
                  });
                }
                return child;
              });
            })}
          </SubTypeBlock>
        ))}
      </AreaBlock>
    </>
  );
};

const EditTags: FC<{
  defaultTagList: abilityListType[];
}> = ({ defaultTagList }) => {
  const [tagList, setTagList] = useState<abilityListType[]>(defaultTagList);

  useEffect(() => {
    if (defaultTagList.length <= 0) {
      setTagList([{ id: uuidv4(), name: "", value: "", subType: '' }]);
      return;
    }
    setTagList(defaultTagList);
  }, [defaultTagList]);

  const onAdd = (index: number) => {
    const newTagList = [...tagList];
    newTagList.splice(index + 1, 0, { id: uuidv4(), name: "", value: "", subType: '' });
    setTagList(newTagList);
  };

  const onUpdate = (index: number, value: string) => {
    const newTagList = [...tagList];
    newTagList[index] = { id: uuidv4(), name: value, value: "", subType: '' };
    setTagList(newTagList);
  };

  const onDelete = (index: number) => {
    setTagList(_.filter(tagList, (v, i) => i !== index));
  };

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          bottom: 8,
          display: "flex",
          justifyContent: "center",
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        {_.map(tagList, (v, i) => {
          return (
            <Box key={v.name} sx={{ position: "relative" }}>
              <TextField
                value={v.name}
                sx={{
                  mr: "2px",
                  borderRadius: 0,
                  fontSize: 16,
                  height: 48,
                  border: "1px solid #80B0D8",
                  boxShadow: "0 0 5px #125585",
                  backgroundColor: "rgba(28,37,71,0.9)",
                  color: "#F6F9FA",
                  width: "fit-content",
                }}
                inputProps={{
                  style: {
                    textAlign: "center",
                    color: "#fff",
                    paddingRight: 4,
                    paddingLeft: 4,
                    width: `${v.name.length + 2}ch`,
                    minWidth: 50,
                  },
                }}
                onChange={(e) => {
                  onUpdate(i, e.target.value);
                }}
              />
              <SiFiIconButton
                edge="end"
                aria-label="delete"
                onClick={() => onDelete(i)}
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 15,
                }}
              >
                <ClearIcon sx={{ height: "0.8em", width: "0.8em" }} />
              </SiFiIconButton>
              <SifiAddButton direction={"down"} onAdd={() => onAdd(i)} />
            </Box>
          );
        })}
      </Box>
    </>
  );
};
