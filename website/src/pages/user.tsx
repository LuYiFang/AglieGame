import React, {
  useRef,
  useEffect,
  FC,
  useState,
  ReactNode,
  ReactElement,
  useMemo,
} from "react";
import {
  Box,
  Chip,
  IconButton,
  Paper,
  SpeedDial,
  SpeedDialAction,
  Typography,
  Theme,
  Button,
} from "@mui/material";
import _ from "lodash";
import SettingButton from "../components/button/SettingButton";
import RadarChart from "../components/chart/RadarChart";
import SkillCircular from "../components/Circular/SkillCircular";
import { Equipment, Quality } from "../components/item/userItem";
import Grid from "@mui/material/Grid2";
import LevelCircle from "../components/Circular/LevelCircle";
import {
  AreaBlock,
  ScrollXBlock,
  SubTypeBlock,
} from "../components/block/UserBlock";
import {
  eqpList,
  personality,
  qualityList,
  skillList,
  polarData,
} from "../utilities/fakeData";
import { abilityListType, UserItemType } from "../types/user.types";
import TextField from "../components/input/TextField";
import AddIcon from "@mui/icons-material/Add";
import { SifiAddButton, SiFiIconButton } from "../components/item/SifiItem";
import ClearIcon from "@mui/icons-material/Clear";
import { v4 as uuidv4 } from "uuid";
import { SubTypeType } from "../types/user.types";

const skillHeight = 200;

export default function User() {
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
            defaultValueList={_.map(eqpList, (v) => ({ ...v, id: uuidv4() }))}
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
            defaultValueList={_.map(qualityList, (v) => ({
              ...v,
              id: uuidv4(),
            }))}
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
            defaultValueList={_.map(skillList, (v) => ({ ...v, id: uuidv4() }))}
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
          >
            <SkillCircular />
          </EditBlock>
        </Grid>
      </Box>
    </div>
  );
}

const EditBlock: FC<{
  defaultValueList: abilityListType[];
  areaParams: { [key: string]: any };
  subParams: { [key: string]: any };
  children: ReactElement<UserItemType>;
}> = ({ defaultValueList, areaParams, subParams, children }) => {
  const [valueList, setValueList] =
    useState<abilityListType[]>(defaultValueList);
  const [subTypeList, setSubTypeList] = useState<SubTypeType[]>([]);

  const subTypeGroup = useMemo(() => {
    console.log("valueList", valueList);
    return _.groupBy(valueList, "subType");
  }, [valueList]);

  useEffect(() => {
    if (defaultValueList.length <= 0) {
      setValueList([{ id: uuidv4(), name: "", value: "", subType: "" }]);
      return;
    }
    setValueList(defaultValueList);
  }, [defaultValueList]);

  const handleAddItem = (type: string) => {
    setValueList([
      ...valueList,
      { id: uuidv4(), name: "", value: "", subType: type },
    ]);
  };

  const handleUpdateItem = (
    id: string,
    property: string | null,
    value: number | string | null,
  ) => {
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
  };

  const handleDeleteItem = (id: string) => {
    const targetIndex = _.findIndex(valueList, { id: id });
    const newValueList = [...valueList];
    newValueList.splice(targetIndex, 1);
    setValueList(newValueList);
  };

  const handleAddSubType = () => {
    setSubTypeList([
      ...subTypeList,
      { id: uuidv4(), name: "", type: "subType" },
    ]);
  };

  const handleUpdateSubType = (index: number, value: string) => {
    // sub type 不能重複
    // setValueList({ ...valueList, "": [] });

    const newSubTypeList = [...subTypeList];
    newSubTypeList[index] = { ...newSubTypeList[index], name: value };
    setSubTypeList(newSubTypeList);
  };

  const handleCloseSybType = () => {
    // _.differenceBy(valu)
  };

  const handleAddProperties = () => {};

  return (
    <>
      <AreaBlock
        settable
        direction="down"
        size={12}
        {...areaParams}
        data={_.map(_.keys(subTypeGroup), (v) => ({
          property: v,
          type: "subType",
        }))}
        onAdd={handleAddSubType}
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
  defaultTagList: string[];
}> = ({ defaultTagList }) => {
  const [tagList, setTagList] = useState<string[]>(defaultTagList);

  useEffect(() => {
    if (defaultTagList.length <= 0) {
      setTagList([""]);
      return;
    }
    setTagList(defaultTagList);
  }, [defaultTagList]);

  const onAdd = (index: number) => {
    const newTagList = [...tagList];
    newTagList.splice(index + 1, 0, "");
    setTagList(newTagList);
  };

  const onUpdate = (index: number, value: string) => {
    const newTagList = [...tagList];
    newTagList[index] = value;
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
            <Box key={v} sx={{ position: "relative" }}>
              <TextField
                value={v}
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
                    width: `${v.length + 2}ch`,
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
