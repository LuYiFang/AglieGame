import { FC } from "react";
import { BlockType } from "@/types/user.types";
import SettingButton from "../button/SettingButton";
import Grid from "@/components/block/Grid";
import { styled } from "@mui/material";

const AreaBlockGrid = styled(Grid)(({ theme }) => ({
  height: "100%",
  padding: theme.spacing(1),
  paddingTop: theme.spacing(3),
  backgroundColor: "rgb(239, 239, 239)",
  textAlign: "center",
  fontFamily: "Roboto, sans-serif",
  fontSize: "18px",
  fontWeight: 500,
  border: "1px solid black",
  display: "flex",
  justifyContent: "start",
  alignItems: "start",
  flexDirection: "column",
  position: "relative",
}));

export const AreaBlock: FC<BlockType> = (props) => {
  const { sx, children, settable, direction, ...others } = props;

  return (
    <AreaBlockGrid sx={{ ...sx }} {...others}>
      <SettingButton
        settable={settable}
        actionType={"block"}
        direction={direction}
      />
      {children}
    </AreaBlockGrid>
  );
};

const SubTypeBlockGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: "#d7d7db",
  textAlign: "center",
  fontFamily: "Roboto, sans-serif",
  fontSize: "18px",
  fontWeight: 500,
  border: "1px solid #7e7e7e",
  marginBottom: theme.spacing(1),
  display: "flex",
  position: "relative",
}));

export const SubTypeBlock: FC<BlockType> = (props) => {
  const { sx, children, settable, direction, ...others } = props;

  return (
    <SubTypeBlockGrid sx={{ ...sx }} {...others}>
      <SettingButton
        settable={settable}
        actionType={"block"}
        direction={direction}
      />
      {children}
    </SubTypeBlockGrid>
  );
};
