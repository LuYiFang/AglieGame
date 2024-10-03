import { FC, KeyboardEvent, useCallback, useEffect, useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import * as _ from "lodash";
import TextField from "../input/TextField";
import { SiFiIconButton } from "../item/SifiItem";

const SiFiListItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: "#222B4C",
  border: "1px solid #4a5681",
  marginBottom: "2px",
}));

const SettingList = styled(List)(({ theme }) => ({
  width: 600,
  [theme.breakpoints.down("sm")]: {
    width: "calc(100vw - 16px)",
  },
}));

const AddList: FC<{
  data?: any[];
  showSubType?: boolean;
  onAdd?: (...args: any[]) => void;
  onDelete?: (...args: any[]) => void;
  onUpdate?: (...args: any[]) => void;
}> = ({
  showSubType = false,
  data = [
    { property: "eefefef", value: "123" },
    { property: "efwfokokg", value: 789 },
  ],
  onAdd = () => {},
  onDelete = () => {},
  onUpdate = () => {},
}) => {
  const [typeList, setTypeList] = useState<any[]>([]);
  const [valueList, setValueList] = useState<any[]>([]);

  useEffect(() => {
    const [newTypeList, newValueList] = _.partition(
      data,
      (v) => v.type === "subType",
    );
    setTypeList(newTypeList);
    setValueList(newValueList);
    // console.log("typeList", newTypeList);
    // console.log("valueList", newValueList);
  }, [data]);

  return (
    <>
      <SettingList>
        {showSubType ? (
          <AddItemListBlock
            blockName={"Sub Type"}
            targetList={typeList}
            setTargetList={setTypeList}
            itemDefault={{ property: "" }}
            onAdd={onAdd}
          />
        ) : (
          ""
        )}
        {showSubType ? <Divider /> : ""}
        <AddItemListBlock
          blockName={"Properties"}
          targetList={valueList}
          setTargetList={setValueList}
          itemDefault={{ property: "", value: "" }}
          onAdd={onAdd}
        />
      </SettingList>
    </>
  );
};
export default AddList;

const AddItemListBlock: FC<{
  blockName: string;
  targetList: any[];
  setTargetList: (arg: any) => void;
  itemDefault?: any;
  onAdd?: (...args: any[]) => void;
  onDelete?: (...args: any[]) => void;
  onUpdate?: (...args: any[]) => void;
}> = (props) => {
  const {
    blockName,
    targetList,
    setTargetList,
    itemDefault,
    onAdd = () => {},
    onDelete = () => {},
    onUpdate = () => {},
  } = props;

  //加了什麼?刪了什麼?
  // 有東西不能刪

  const handleAddItem = () => {
    setTargetList([...targetList, { ...itemDefault }]);
  };

  const handleUpdateItem = (
    index: number,
    property: string | null,
    value: string | number | null,
  ) => {
    if (property === null && value === null) {
      return;
    }

    const newList = [...targetList];
    const newItem = {
      ...targetList[index],
    };

    if (value === null) {
      newItem["property"] = property;
    }

    if (property === null) {
      newItem["value"] = value;
    }

    newList.splice(index, 1, newItem);
    setTargetList(newList);
  };

  const handleDeleteItem = (index: number) => {
    const newValueList = [...targetList];
    newValueList.splice(index, 1);
    setTargetList(newValueList);
  };

  return (
    <>
      <Typography>{blockName}</Typography>
      {_.map(targetList, (row, i) => {
        return (
          <SiFiListItem
            key={`setting-item-${i}`}
            dense
            secondaryAction={
              <SiFiIconButton
                edge="end"
                aria-label="delete"
                onClick={() => {
                  handleDeleteItem(i);
                }}
                sx={{
                  color: "#F6F9FA",
                  "&:hover": {
                    backgroundColor: "rgba(28,37,71)",
                  },
                }}
              >
                <ClearIcon sx={{ height: "0.8em", width: "0.8em" }} />
              </SiFiIconButton>
            }
            sx={{
              p: 0,
            }}
          >
            <ListItemButton
              sx={{
                p: 0,
              }}
            >
              <Box
                sx={{
                  borderRightStyle: "solid",
                  borderRightColor: "#4a5681",
                  borderRightWidth: 1,
                  paddingX: 6,
                  paddingY: "4px",
                  width: "100%",
                }}
              >
                <TextField
                  value={targetList[i].name}
                  inputProps={{ style: { height: "30px" } }}
                  onChange={(e) => {
                    handleUpdateItem(i, e.target.value, null);
                  }}
                  placeholder={
                    blockName === "Sub Type" ? "Type name" : "Property name"
                  }
                />
              </Box>
              {targetList[i].value !== undefined ? (
                <Box
                  sx={{
                    paddingX: 6,
                    paddingY: "4px",
                    width: "100%",
                    borderRightStyle: "solid",
                    borderRightColor: "#4a5681",
                    borderRightWidth: 1,
                  }}
                >
                  <TextField
                    autoFocus={false}
                    value={targetList[i].value}
                    inputProps={{ style: { height: "30px" } }}
                    onChange={(e) => {
                      handleUpdateItem(i, null, e.target.value);
                    }}
                    placeholder="Value"
                  />
                </Box>
              ) : (
                ""
              )}
            </ListItemButton>
          </SiFiListItem>
        );
      })}

      <ListItemButton
        sx={{ display: "flex", justifyContent: "center" }}
        onClick={() => handleAddItem()}
      >
        <AddIcon />
      </ListItemButton>
    </>
  );
};
