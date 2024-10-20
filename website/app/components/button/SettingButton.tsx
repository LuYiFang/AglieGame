import { FC, useRef, useState } from "react";
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
  data: { subTypeList?: any[]; propertyList: any[] };
  showSubType?: boolean;
  onSave?: (...args: any[]) => void;
}> = (props) => {
  const {
    settable,
    direction = "down",
    data,
    showSubType,
    onSave = () => {},
  } = props;

  const [open, setOpen] = useState(false);
  const listRef = useRef();

  const handleClose = () => {
    setOpen(false);
    onSave(listRef.current?.getValue());
  };

  return (
    <>
      <IconButtonFixed onClick={() => setOpen(!open)}>
        <SettingsIcon />
      </IconButtonFixed>
      <UserSettingDialog open={open} onClose={handleClose}>
        <AddList ref={listRef} data={data} showSubType={showSubType} />
      </UserSettingDialog>
    </>
  );
};
export default SettingButton;
