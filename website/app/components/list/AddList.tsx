import {
  FC,
  forwardRef,
  ForwardRefRenderFunction,
  KeyboardEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
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
import { v4 as uuidv4 } from "uuid";

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

const AddList: ForwardRefRenderFunction<
  any,
  {
    data?: any[];
    showSubType?: boolean;
    onSave?: (...args: any[]) => void;
  }
> = ({ showSubType = false, data = [] }, ref) => {
  const [typeList, setTypeList] = useState<any[]>([]);
  const [propertyList, setPropertyList] = useState<any[]>([]);

  useImperativeHandle(ref, () => ({
    getValue: () => {
      return { typeList, propertyList };
    },
  }));

  useEffect(() => {
    const [newTypeList, newValueList] = _.partition(
      data,
      (v) => v.type === "subType",
    );
    setTypeList(newTypeList);
    setPropertyList(newValueList);
  }, [data]);

  return (
    <>
      <SettingList>
        {showSubType ? (
          <AddItemListBlock
            blockName={"Sub Type"}
            targetList={typeList}
            setTargetList={setTypeList}
            itemDefault={{ name: "" }}
          />
        ) : (
          ""
        )}
        {showSubType ? <Divider /> : ""}
        <AddItemListBlock
          blockName={"Properties"}
          targetList={propertyList}
          setTargetList={setPropertyList}
          itemDefault={{ name: "", value: "" }}
        />
      </SettingList>
    </>
  );
};
export default forwardRef(AddList);

const AddItemListBlock: FC<{
  blockName: string;
  targetList: any[];
  setTargetList: (arg: any) => void;
  itemDefault?: any;
}> = (props) => {
  const { blockName, targetList, setTargetList, itemDefault } = props;

  //加了什麼?刪了什麼?
  // 有東西不能刪

  const handleAddItem = () => {
    setTargetList([...targetList, { ...itemDefault, id: uuidv4() }]);
  };

  const handleUpdateItem = (
    index: number,
    name: string | null,
    value: string | number | null,
  ) => {
    if (name === null && value === null) {
      return;
    }

    const newList = [...targetList];
    const newItem = {
      ...targetList[index],
    };

    if (value === null) {
      newItem["name"] = name;
    }

    if (name === null) {
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
