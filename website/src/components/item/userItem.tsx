import { Box, Typography, styled } from "@mui/material";
import { FC } from "react";
import SettingButton from "../button/SettingButton";
import Grid from "@/components/block/Grid";
import { ItemType } from "@/types/user.types";
import { SiFiItem } from "./SifiItem";

const EquipmentBox = styled(Box)(({ theme }) => ({
  position: "relative",
  height: 40,
  width: 80,
  marginRight: theme.spacing(1),
  padding: theme.spacing(1),
  boxShadow: "0 0 4px rgba(0, 163, 224, 0.5)",
  textAlign: "center",
  fontFamily: "Roboto, sans-serif",
  fontSize: "18px",
  fontWeight: 500,
  pt: "6px",
  "&::after": {
    content: '""',
    position: "absolute",
    border: "1px solid #4987b1",
    width: "100%",
    height: "100%",
    top: -5,
    left: -5,
  },
  backgroundColor: "#222B4C",
  border: "1px solid #4a5681",
  color: "#F6F9FA",
}));

export const Equipment: FC<ItemType> = (props) => {
  const { name, settable } = props;
  return (
    <Box
      sx={{
        position: "relative",
        height: 84,
        display: "flex",
        alignItems: "center",
        paddingTop: "4px",
        paddingBottom: "4px",
      }}
    >
      <SettingButton settable={settable} actionType="item" data={[]} />
      <SiFiItem text={name} style={{ width: "100%", maxHeight: "100%" }} />
    </Box>
  );
};

const QualityGird = styled(Grid)(({ theme }) => ({
  position: "relative",
  height: 40,
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1),
  textAlign: "center",
  fontFamily: "Roboto, sans-serif",
  fontSize: "18px",
  fontWeight: 500,
  pt: "6px",
  "&::after": {
    content: '""',
    position: "absolute",
    border: "1px solid #4987b1",
    width: "100%",
    height: "100%",
    top: -5,
    left: -5,
  },
  backgroundColor: "#222B4C",
  border: "1px solid #4a5681",
  color: "#F6F9FA",
}));

export const Quality: FC<ItemType & { score: number }> = (props) => {
  const { name, score, settable } = props;
  return (
    <QualityGird container xs={12}>
      <SettingButton settable={settable} actionType="item" data={[]} />
      <Grid xs={8} sx={{ display: "flex" }}>
        <Typography>{name}</Typography>
      </Grid>
      <Grid xs={4} sx={{ display: "flex" }}>
        <Typography>{score}</Typography>
      </Grid>
    </QualityGird>
  );
};

const LevelCircleBox = styled(Box)(({ theme }) => ({
  borderRadius: "50%",
  backgroundColor: "transparent",
  border: "2px solid #00ff00",
  position: "relative",
  animation: "pulse 2s infinite",
}));

const LevelCircleSubBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  background: "linear-gradient(225deg, #00ff00, #00ffff, #ff00ff, #ff00ff)",
  animation: "rotate 4s linear infinite",
}));
