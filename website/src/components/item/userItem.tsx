import { Box, Typography, styled } from "@mui/material";
import { FC } from "react";
import SettingButton from "../button/SettingButton";
import Grid from "@/components/block/Grid";
import { ItemType } from "@/types/user.types";

const EquipmentBox = styled(Box)(({ theme }) => ({
  position: "relative",
  height: 40,
  width: 80,
  marginRight: theme.spacing(1),
  backgroundColor: "rgba(119, 140, 173, 0.7)",
  border: "1px solid #7e7e7e",
  color: "#002156",
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
    border: "1px solid #16223c",
    width: "100%",
    height: "100%",
    top: -5,
    left: -5,
  },
}));

export const Equipment: FC<ItemType> = (props) => {
  const { name, settable } = props;
  return (
    <EquipmentBox>
      <SettingButton settable={settable} actionType="item" />
      <Typography
        sx={{
          position: "absolute",
          top: "47%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {name}
      </Typography>
    </EquipmentBox>
  );
};

const QualityGird = styled(Grid)(({ theme }) => ({
  position: "relative",
  height: 40,
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  backgroundColor: "rgba(119, 140, 173, 0.7)",
  border: "1px solid #7e7e7e",
  color: "#002156",
  padding: theme.spacing(1),
  textAlign: "center",
  fontFamily: "Roboto, sans-serif",
  fontSize: "18px",
  fontWeight: 500,
  pt: "6px",
  "&::after": {
    content: '""',
    position: "absolute",
    border: "1px solid #16223c",
    width: "100%",
    height: "100%",
    top: -5,
    left: -5,
  },
}));

export const Quality: FC<ItemType & { score: number }> = (props) => {
  const { name, score, settable } = props;
  return (
    <QualityGird container xs={12}>
      <SettingButton settable={settable} actionType="item" />
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

export const LevelCircle = () => {
  return (
    <LevelCircleBox width={100} height={100}>
      <LevelCircleSubBox />
    </LevelCircleBox>
  );
};
