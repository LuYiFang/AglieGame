import { FC } from "react";
import {
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
import { direction, actionType } from "@/types/user.types";

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

const SpeedDialTransparent = styled(SpeedDial)<MySpeedDialProps>(
  ({ theme, direction, actionsLength }) => ({
    position: "absolute",
    top: direction === "down" ? 0 : -(actionsLength + 1) * 24 - 8,
    right: 0,
    padding: 0,
    zIndex: 1,
    opacity: 0,
    "&:hover": {
      opacity: 1,
    },

    "& .MuiSpeedDial-fab": {
      minHeight: 24,
      height: 24,
      width: 24,
      backgroundColor: "transparent",
      color: "rgba(0, 0, 0, 0.6)",
      boxShadow: "none",
    },
    "& .MuiSpeedDial-fab:hover": {
      backgroundColor: "transparent",
    },
  }),
);

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
  actionType?: actionType;
  direction?: direction;
}> = (props) => {
  const { settable, actionType = "block", direction = "down" } = props;

  const actions = actionType === "block" ? blockActions : itemActions;

  return (
    <>
      <SpeedDialTransparent
        ariaLabel="Settings"
        hidden={!settable}
        icon={<SettingsIcon />}
        direction={direction}
        actionsLength={actions.length}
      >
        {_.map(actions, (action) => (
          <SpeedDialActionTransparent
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDialTransparent>
    </>
  );
};
export default SettingButton;
