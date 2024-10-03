import { Box, Typography, styled, IconButton } from "@mui/material";
import { FC, forwardRef, useImperativeHandle, useState } from "react";
import SettingButton from "../button/SettingButton";
import Grid from "@mui/material/Grid2";
import { ItemType } from "../../types/user.types";
import { SiFiItem } from "./SifiItem";
import TextField from "../input/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import { SiFiIconButton } from "./SifiItem";

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

export const Equipment: FC<
  ItemType & {
    score?: string;
    onDelete?: (...args: any[]) => void;
    onUpdate?: (...args: any[]) => void;
  }
> = (props) => {
  const {
    name = "",
    score: imgPath = "",
    settable = false,
    onDelete,
    onUpdate,
  } = props;

  return (
    <Grid
      size={12}
      sx={{
        position: "relative",
        height: 84,
        display: "flex",
        alignItems: "center",
        paddingTop: "4px",
        paddingBottom: "4px",
      }}
    >
      <SettingButton settable={settable} data={[]} />
      <SiFiItem text={name} imgPath={imgPath} onUpdate={onUpdate} />
      <SiFiIconButton
        onClick={onDelete}
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          zIndex: 1,
        }}
      >
        <ClearIcon />
      </SiFiIconButton>
    </Grid>
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
  // fontWeight: 550,
  pt: "6px",
  backgroundColor: "transparent",
  color: "#F6F9FA",
}));

export const Quality: FC<
  ItemType & {
    score?: number | string;
    onDelete?: (...args: any[]) => void;
    onUpdate?: (...args: any[]) => void;
  }
> = forwardRef((props, ref) => {
  const {
    name: defaultName = "",
    score: defaultScore = 0,
    settable = false,
    onDelete = () => {},
    onUpdate = () => {},
  } = props;

  const [name, setName] = useState<string>(defaultName);
  const [score, setScore] = useState<number | string>(defaultScore);

  useImperativeHandle(ref, () => ({
    getValue: () => ({ name, score }),
  }));

  return (
    <QualityGird container size={12}>
      <Grid size={7} sx={{ display: "flex", pr: 1 }}>
        <TextField
          value={name}
          inputProps={{ style: { height: "30px", fontWeight: 550 } }}
          onChange={(e) => {
            setName(e.target.value);
            onUpdate(e.target.value, null);
          }}
        />
      </Grid>
      <Grid size={4} sx={{ display: "flex" }}>
        <TextField
          type="number"
          autoFocus={false}
          value={score}
          inputProps={{ style: { height: "30px", fontWeight: 550 } }}
          onChange={(e) => {
            setScore(parseInt(e.target.value));
            onUpdate(null, parseInt(e.target.value));
          }}
          sx={{
            "& ::-webkit-outer-spin-button": {
              "-webkit-appearance": "none",
              margin: 0,
            },
            "& ::-webkit-inner-spin-button": {
              "-webkit-appearance": "none",
              margin: 0,
            },
          }}
        />
      </Grid>
      <Grid size={1}>
        <SiFiIconButton edge="end" aria-label="delete" onClick={onDelete}>
          <ClearIcon sx={{ height: "0.8em", width: "0.8em" }} />
        </SiFiIconButton>
      </Grid>
    </QualityGird>
  );
});

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
