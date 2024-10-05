import { FC, ReactNode, forwardRef, useEffect, useRef, useState } from "react";
import { BlockType } from "../../types/user.types";
import SettingButton from "../button/SettingButton";
import Grid from "@mui/material/Grid2";
// import Grid from "./Grid";
import { Box, Button, styled, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { SifiAddButton } from "../item/SifiItem";

export const SiFiBox = styled(Box)(({ theme }) => ({
  border: "1px solid #80B0D8",
  boxShadow: "0 0 5px #125585",
  backgroundColor: "rgba(28,37,71,0.9)",
}));

const AreaBlockGrid = styled(Grid)(({ theme }) => ({
  height: "100%",
  padding: theme.spacing(1),
  paddingTop: theme.spacing(3),
  textAlign: "center",
  fontFamily: "Roboto, sans-serif",
  fontSize: "18px",
  fontWeight: 500,
  border: "1px solid black",
  display: "flex",
  justifyContent: "start",
  alignItems: "start",
  position: "relative",
  backgroundColor: "rgba(80, 136, 200, 0.6)",

  overflowY: "auto",
  flexDirection: "row",
}));

export const AreaBlock: FC<BlockType> = forwardRef<HTMLDivElement, BlockType>(
  (props, ref) => {
    const {
      sx,
      children,
      settable,
      direction,
      data,
      onSave = () => {},
      ...others
    } = props;

    return (
      <AreaBlockGrid ref={ref} sx={{ ...sx }} {...others}>
        <SettingButton
          settable={settable}
          direction={direction}
          data={data}
          showSubType={true}
          onSave={onSave}
        />
        {children}
      </AreaBlockGrid>
    );
  },
);

const SubTypeBlockGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
  fontFamily: "Roboto, sans-serif",
  fontSize: "18px",
  fontWeight: 500,
  marginBottom: theme.spacing(1),
  display: "flex",
  position: "relative",
  border: "1px solid #80B0D8",
  boxShadow: "0 0 5px #125585",
  backgroundColor: "rgba(28,37,71,0.7)",
}));

export const SubTypeBlock: FC<BlockType> = (props) => {
  const {
    title,
    sx,
    children,
    settable,
    direction,
    onAdd = () => {},
    ...others
  } = props;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        ...(direction === "down" && { height: "100%" }),
        width: "100%",
      }}
    >
      <Typography variant="h6" color="rgba(28,37,71)">
        {title}
      </Typography>
      <SubTypeBlockGrid sx={{ ...sx }} {...others}>
        <SettingButton settable={settable} direction={direction} data={[]} />
        {children}
        <SifiAddButton direction={direction} onAdd={onAdd} />
      </SubTypeBlockGrid>
    </div>
  );
};

export const ScrollXBlock: FC<{ children: ReactNode }> = (props) => {
  const { children, ...others } = props;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (ref.current) {
        const container = ref.current;
        const amountToScroll = e.deltaY;
        container.scrollLeft += amountToScroll;
      }
    };

    const block = ref.current;
    if (block) {
      block.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (block) {
        block.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  return <AreaBlock ref={ref}>{children}</AreaBlock>;
};
