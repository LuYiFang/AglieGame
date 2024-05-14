import { FC, KeyboardEvent, useCallback, useState } from "react";
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  styled,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import * as _ from "lodash";
import TextField from "../input/TextField";

const SettingList = styled(List)(({ theme }) => ({
  width: 600,
  [theme.breakpoints.down("sm")]: {
    width: "calc(100vw - 16px)",
  },
}));

const AddList: FC<{ data?: any[] }> = ({
  data = [{ item: "eefefef" }, { item: "efwfokokg" }],
}) => {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [valueList, setValueList] = useState(data);

  const startEdit = (index: number) => {
    setEditingRow(index);
  };

  const closeEdit = () => {
    setEditingRow(null);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      closeEdit();
    }
  };

  const handleAddItem = () => {
    setValueList([...valueList, { item: "" }]);
  };

  const handleUpdateItem = (index: number, value: string) => {
    const newValueList = [...valueList];
    newValueList.splice(index, 1, {
      ...valueList[index],
      item: value,
    });
    setValueList(newValueList);
  };

  const handleDeleteItem = (index: number) => {
    const newValueList = [...valueList];
    newValueList.splice(index, 1);
    setValueList(newValueList);
  };

  console.log("valueList", valueList);

  return (
    <>
      <SettingList>
        {_.map(valueList, (row, i) => {
          return (
            <ListItem
              key={`setting-item-${i}`}
              dense
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => {
                    handleDeleteItem(i);
                  }}
                >
                  <ClearIcon />
                </IconButton>
              }
            >
              <ListItemButton
                selected={editingRow == i}
                onClick={(e) => {
                  console.log("button click");
                  startEdit(i);
                }}
                onBlur={closeEdit}
                onKeyUp={handleKeyUp}
              >
                <TextField
                  value={valueList[i].item}
                  inputProps={{ style: { height: "30px" } }}
                  onChange={(e) => {
                    handleUpdateItem(i, e.target.value);
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
        <ListItemButton
          sx={{ display: "flex", justifyContent: "center" }}
          onClick={() => handleAddItem()}
        >
          <AddIcon />
        </ListItemButton>
      </SettingList>
    </>
  );
};
export default AddList;
