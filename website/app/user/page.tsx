"use client";
import React, { useEffect, useState } from "react";
import { Box, Theme } from "@mui/material";
import * as _ from "lodash";
import Grid from "@mui/material/Grid2";
// import Grid from "./components/block/Grid";
import { v4 as uuidv4 } from "uuid";
import { actions } from "@/lib/features/user/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import {
  eqpList,
  personality,
  polarData,
  portraitData,
  qualityList,
  skillList,
} from "@/lib/utilities/fakeData";
import {
  EditBlock,
  EditMiddle,
  skillHeight,
} from "../components/block/userArea";
import { Equipment, Quality } from "../components/item/userItem";
import { AreaBlock } from "../components/block/UserBlock";
import LevelCircle from "../components/Circular/LevelCircle";
import SkillCircular from "../components/Circular/SkillCircular";

export default function UserPage() {
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    dispatch(
      actions["eqp"].setAll(_.map(eqpList, (v) => ({ ...v, id: uuidv4() }))),
    );
    dispatch(
      actions["skill"].setAll(
        _.map(skillList, (v) => ({ ...v, id: uuidv4() })),
      ),
    );
    dispatch(
      actions["quality"].setAll(
        _.map(qualityList, (v) => ({ ...v, id: uuidv4() })),
      ),
    );
    dispatch(
      actions["personality"].setAll(
        _.map(personality, (v) => ({ ...v, id: uuidv4() })),
      ),
    );
    dispatch(
      actions["polarProper"].setAll(
        _.map(polarData, (v) => ({ ...v, id: uuidv4() })),
      ),
    );
    dispatch(
      actions["portrait"].setAll(
        _.map(portraitData, (v) => ({ ...v, id: uuidv4() })),
      ),
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 32px)",
        backgroundColor: "white",
      }}
    >
      <Box
        sx={(theme) => ({
          height: "100%",
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          [theme.breakpoints.down("md")]: {
            display: "block",
          },
        })}
      >
        <Grid
          container
          size={12}
          sx={{ flex: 2, maxHeight: `calc(100% - ${skillHeight}px)` }}
        >
          <EditBlock
            areaParams={{
              container: true,
              size: { md: 3 },
              sx: { zIndex: 1 },
            }}
            subParams={{
              container: true,
              direction: "up",
              sx: { flexDirection: "column", width: "100%" },
            }}
            name="eqp"
          >
            <Equipment />
          </EditBlock>
          <EditMiddle />
          <EditBlock
            areaParams={{
              container: true,
              size: { md: 3 },
            }}
            subParams={{
              sx: {
                flexDirection: "column",
                width: "100%",
              },
              direction: "up",
            }}
            name="quality"
          >
            <Quality />
          </EditBlock>
        </Grid>
        <Grid
          container
          size={12}
          sx={(theme) => ({
            minHeight: skillHeight,
            maxHeight: skillHeight,
            [theme.breakpoints.down("md")]: {
              maxHeight: 50,
            },
            flex: 1,
          })}
        >
          <AreaBlock
            size={{ xs: 12, md: 1 }}
            sx={(theme: Theme) => ({
              maxWidth: 230,
              [theme.breakpoints.down("md")]: {
                maxWidth: "100vw",
              },
            })}
          >
            <LevelCircle />
          </AreaBlock>
          <EditBlock
            areaParams={{
              size: { md: 11 },
              onWheel: (e: WheelEvent) => {
                const container = e.currentTarget as HTMLDivElement;
                container.scrollLeft += e.deltaY;
              },
              sx: {
                pt: 0,
                overflowX: "auto",
                overflowY: "hidden",
                display: "flex",
              },
            }}
            subParams={{
              sx: {
                width: "fit-content",
                alignItems: "center",
                flexShrink: 0,
                pt: 1,
                mr: 1,
              },
              direction: "down",
            }}
            name="skill"
          >
            <SkillCircular />
          </EditBlock>
        </Grid>
      </Box>
    </div>
  );
}
