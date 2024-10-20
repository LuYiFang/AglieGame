import React, {
  useEffect,
  FC,
  useState,
  ReactElement,
  useMemo,
  ReactNode,
  useRef,
} from "react";
import { Box } from "@mui/material";
import * as _ from "lodash";
import SettingButton from "../button/SettingButton";
import RadarChart from "../chart/RadarChart";
import { AreaBlock, SubTypeBlock } from "../block/UserBlock";
import TextField from "../input/TextField";
import { SifiAddButton, SiFiIconButton } from "../item/SifiItem";
import ClearIcon from "@mui/icons-material/Clear";
import { v4 as uuidv4 } from "uuid";
import { selectors } from "@/lib/store";
import { actions, ReducerActions } from "@/lib/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  abilityListType,
  SubTypeType,
  UserItemType,
} from "@/lib/types/user.types";
import Grid from "./Grid";
import ImageSelector from "../input/ImageSelector";
import HealthBar from "../item/HealthBar";

export const skillHeight = 200;

const CURDBlock: FC<{
  action: ReducerActions;
  children: (...args: any[]) => ReactNode;
  selectAll: (...args: any[]) => any;
}> = ({ children, action, selectAll }) => {
  const dispatch = useAppDispatch();
  const valueList = useAppSelector(selectAll);

  useEffect(() => {
    if (!valueList) return;
    if (valueList.length > 0) return;

    dispatch(action.setAll(""));
  }, [valueList]);

  const handleAddItem = (type: string) => {
    dispatch(action.addItem(type));
  };

  const handleUpdateItem = (id: string, updateData: { [key: string]: any }) => {
    dispatch(action.updateItem({ id, updateData, valueList }));
  };

  const handleDeleteItem = (id: string) => {
    dispatch(action.removeItem(id));
  };

  return (
    <>
      {children({
        valueList,
        handleAddItem,
        handleUpdateItem,
        handleDeleteItem,
      })}
    </>
  );
};

export const EditBlock: FC<{
  areaParams: { [key: string]: any };
  subParams: { [key: string]: any };
  children: ReactElement<UserItemType>;
  name: string;
}> = ({ areaParams, subParams, children, name }) => {
  const dispatch = useAppDispatch();
  const properName = `${name}Proper`;
  const propertyList = useAppSelector(selectors[`${properName}All`]);
  const action = actions[name];
  const actionProper = actions[properName];

  const [subTypeList, setSubTypeList] = useState<SubTypeType[]>([]);

  return (
    <>
      <CURDBlock action={action} selectAll={selectors[`${name}All`]}>
        {({ valueList, handleAddItem, handleUpdateItem, handleDeleteItem }) => {
          const subTypeGroup = useMemo(() => {
            return _.groupBy(valueList, "subType");
          }, [valueList]);

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

          const handleSaveSubType = ({
            subTypeList: typeList,
            propertyList,
          }) => {
            dispatch(action.saveSubType({ subTypeList, typeList, valueList }));
            dispatch(actionProper.setAll(propertyList));
          };

          return (
            <AreaBlock
              settable
              direction="down"
              {...areaParams}
              data={{ subTypeList, propertyList }}
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
                          data: item,
                          onUpdate: (updateData: { [key: string]: any }) =>
                            handleUpdateItem(item.id, updateData),
                          onDelete: () => handleDeleteItem(item.id),
                        });
                      }
                      return child;
                    });
                  })}
                </SubTypeBlock>
              ))}
            </AreaBlock>
          );
        }}
      </CURDBlock>
    </>
  );
};

export const EditTags = () => {
  const name = "personality";
  return (
    <>
      <CURDBlock action={actions[name]} selectAll={selectors[`${name}All`]}>
        {({ valueList, handleAddItem, handleUpdateItem, handleDeleteItem }) => {
          return (
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                display: "flex",
                justifyContent: "start",
                width: "100%",
                flexWrap: "wrap",
                alignItems: "end",
              }}
            >
              <Box
                sx={{
                  height: 72,
                  width: 72,
                  marginRight: 2,
                  padding: (theme) => theme.spacing(1),
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "36px",
                  fontWeight: 500,
                  display: "flex",
                  border: "1px solid #80B0D8",
                  boxShadow: "0 0 5px #125585",
                  // backgroundColor: "rgba(28,37,71,0.7)",
                }}
              >
                E
              </Box>
              {_.map(valueList, (v) => {
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
                        handleUpdateItem(v.id);
                      }}
                    />
                    <SiFiIconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteItem(v.id)}
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
                    <SifiAddButton
                      direction={"down"}
                      onAdd={() => () => handleAddItem("")}
                    />
                  </Box>
                );
              })}
            </Box>
          );
        }}
      </CURDBlock>
    </>
  );
};

export const EditRadar = () => {
  const dispatch = useAppDispatch();
  const name = "polar";
  const properName = `${name}Proper`;
  const propertyList = useAppSelector(selectors[`${properName}All`]);

  const handleSaveSubType = ({ propertyList }) => {
    dispatch(actions[properName].setAll(propertyList));
  };

  const normalization = (data, start, end, min = null, max = null) => {
    const _min = min || _.min(data);
    const _max = max || _.max(data);
    return _.map(
      data,
      (v) => ((end - start) * (v - _min)) / (_max - _min) + start,
    );
  };

  const polarData = useMemo(() => {
    const theta = [];
    let r = [];

    _.each(propertyList, (v) => {
      theta.push(v.name);
      r.push(v.value);
    });

    const first = _.first(propertyList);
    if (first) {
      theta.push(first.name);
      r.push(first.value);
    }
    r = normalization(r, 0, 5);

    return [
      {
        type: "scatterpolar",
        mode: "lines",
        fill: "toself",
        theta: theta,
        r: r,
      },
    ];
  }, [propertyList]);

  return (
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
      <SettingButton
        settable
        showSubType={false}
        data={{ propertyList }}
        onSave={handleSaveSubType}
      />
      <RadarChart data={polarData} />
    </Box>
  );
};

export const EditMiddle = () => {
  const [open, setOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const name = "portrait";
  const valueList = useAppSelector(selectors[`${name}All`]);

  const healthRef = useRef();

  const img = useMemo(() => {
    return _.first(valueList)?.value || "";
  }, [valueList]);

  const openFileSelector = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = (imgUrl: string) => {
    dispatch(
      actions[name].setAll([
        { id: "", name: "", value: imgUrl, subType: "image" },
      ]),
    );
  };

  return (
    <>
      <AreaBlock
        size={{ xs: 12, md: 6 }}
        settable
        direction="down"
        sx={{ backgroundColor: "#FBFBFB", overflowX: "visible" }}
      >
        <HealthBar
          ref={healthRef}
          sx={{
            position: "absolute",
            top: 10,
            left: 30,
            right: 30,
          }}
        />
        <Box
          sx={(theme) => ({
            backgroundColor: "transparent",
            width: "100%",
            height: "100%",
            position: "absolute",
            overflowX: "visible",
            top: 0,
            left: 0,
            right: 0,
            [theme.breakpoints.down("md")]: {
              height: 500,
            },
          })}
          onDoubleClick={openFileSelector}
        >
          <ImageSelector
            defaultImg={img}
            open={open}
            onClose={handleClose}
            onSave={handleSave}
            imgProps={{
              style: {
                maxHeight: `calc(100vh - ${skillHeight + 32}px)`,
                width: "calc(100vw - 20vw)",
                left: "10vw",
                position: "fixed",
              },
            }}
          />
        </Box>
        <EditTags />
        <EditRadar />
      </AreaBlock>
    </>
  );
};
