import { FC, useState } from "react";
import {
  Button,
  IconButton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialProps,
  styled,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import DetailsIcon from "@mui/icons-material/Details";
import _ from "lodash";
import { direction, actionType } from "../../types/user.types";
import AddList from "../list/AddList";
import UserSettingDialog from "../dialog/UserSettingDialog";

const blockActions = [
  { icon: <DetailsIcon />, name: "Setting" },
  { icon: <AddIcon />, name: "Add" },
];

const itemActions = [
  { icon: <DetailsIcon />, name: "Setting" },
  { icon: <EditIcon />, name: "Edit" },
  { icon: <ClearIcon />, name: "Delete" },
];

interface MySpeedDialProps extends SpeedDialProps {
  actionsLength: number;
  direction?: "up" | "down";
}

const IconButtonFixed = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: 0,
  right: 0,
  padding: 0,
  zIndex: 1,
  opacity: 0,
  "&:hover": {
    opacity: 1,
  },
}));

const SpeedDialActionTransparent = styled(SpeedDialAction)(({ theme }) => ({
  "&.MuiSpeedDialAction-fab": {
    minHeight: 16,
    height: 16,
    width: 16,
    backgroundColor: "transparent",
    boxShadow: "none",
  },
}));

const SettingButton: FC<{
  settable?: boolean;
  direction?: direction;
  data: any[];
  showSubType?: boolean;
  onAdd?: (...args: any[]) => void;
  onDelete?: (...args: any[]) => void;
  onUpdate?: (...args: any[]) => void;
}> = (props) => {
  const {
    settable,
    direction = "down",
    data,
    showSubType,
    onAdd = () => {},
    onDelete = () => {},
    onUpdate = () => {},
  } = props;

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButtonFixed onClick={() => setOpen(!open)}>
        <SettingsIcon />
      </IconButtonFixed>
      <UserSettingDialog open={open} onClose={handleClose}>
        <AddList
          data={data}
          showSubType={showSubType}
          onAdd={onAdd}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      </UserSettingDialog>
    </>
  );
};
export default SettingButton;
