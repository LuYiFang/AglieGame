import { FC, ReactNode, forwardRef, useEffect, useRef } from "react";
import { BlockType } from "@/types/user.types";
import SettingButton from "../button/SettingButton";
import Grid from "@/components/block/Grid";
import { Box, styled } from "@mui/material";

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
  flexDirection: "column",
  position: "relative",
  backgroundColor: "rgba(80, 136, 200, 0.6)",
}));

export const AreaBlock: FC<BlockType> = forwardRef<HTMLDivElement, BlockType>(
  (props, ref) => {
    const { sx, children, settable, direction, ...others } = props;

    return (
      <AreaBlockGrid ref={ref} sx={{ ...sx }} {...others}>
        <SettingButton
          settable={settable}
          actionType={"block"}
          direction={direction}
          data={[]}
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
  const { sx, children, settable, direction, ...others } = props;

  return (
    <SubTypeBlockGrid sx={{ ...sx }} {...others}>
      <SettingButton
        settable={settable}
        actionType={"block"}
        direction={direction}
        data={[]}
      />
      {children}
    </SubTypeBlockGrid>
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
