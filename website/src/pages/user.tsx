import {
  Box,
  Chip,
  IconButton,
  Paper,
  SpeedDial,
  SpeedDialAction,
  Typography,
  Theme,
} from "@mui/material";

import _ from "lodash";
import { useRef, useEffect, FC } from "react";
import SettingButton from "@/components/button/SettingButton";
import RadarChart from "@/components/chart/RadarChart";
import {
  AreaBlock,
  ScrollXBlock,
  SubTypeBlock,
} from "@/components/block/UserBlock";
import {
  eqpList,
  personality,
  polarData,
  qualityList,
  skillList,
} from "@/utilities/fakeData";
import SkillCircular from "@/components/Circular/SkillCircular";
import { Equipment, Quality } from "@/components/item/userItem";
import Grid from "@/components/block/Grid";
import LevelCircle from "@/components/Circular/LevelCircle";

const skillHeight = 200;

export default function User() {
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
        <Grid container xs={12} sx={{ flex: 2 }}>
          <AreaBlock container settable xs={12} md={3} sx={{ zIndex: 1 }}>
            {_.map(eqpList, (eqps, type) => (
              <SubTypeBlock
                key={`${type}`}
                xs={12}
                settable
                direction="down"
                sx={{ flexDirection: "column" }}
              >
                {_.map(eqps, (eqp) => (
                  <Equipment key={`${eqp.name}`} name={eqp.name} settable />
                ))}
              </SubTypeBlock>
            ))}
          </AreaBlock>
          <AreaBlock
            xs={12}
            md={6}
            settable
            direction="down"
            sx={{ backgroundColor: "#FBFBFB" }}
          >
            <Box
              sx={(theme) => ({
                backgroundColor: "transparent",
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 0,
                [theme.breakpoints.down("md")]: {
                  height: 500,
                },
              })}
            >
              <img
                src="/charactar3.jpg"
                style={{
                  zIndex: 0,
                  maxHeight: `calc(100vh - ${skillHeight + 32}px)`,
                  // height: "100vh",
                }}
              />
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                display: "flex",
                justifyContent: "center",
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              {_.map(personality, (v) => {
                return (
                  <Box key={v} sx={{ position: "relative" }}>
                    <SettingButton settable actionType="item" data={[]} />
                    <Chip
                      label={v}
                      // size="80"
                      variant="outlined"
                      sx={{
                        mr: "2px",
                        borderRadius: 0,
                        fontSize: 16,
                        height: 48,
                        border: "1px solid #80B0D8",
                        boxShadow: "0 0 5px #125585",
                        backgroundColor: "rgba(28,37,71,0.9)",
                        color: "#F6F9FA",
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: 24,
                right: 0,
                width: 200,
                height: 200,
                backgroundColor: "transparent",
              }}
            >
              <SettingButton settable data={[]} />
              <RadarChart data={polarData} />
            </Box>
          </AreaBlock>
          <AreaBlock container xs={12} md={3} settable direction="down">
            {_.map(qualityList, (subType, type) => (
              <SubTypeBlock
                container
                settable
                key={`${type}`}
                xs={12}
                sx={{
                  flexDirection: "column",
                }}
                direction="down"
              >
                {_.map(subType, (item) => (
                  <Quality
                    key={`${item.name}`}
                    name={item.name}
                    score={item.score}
                    settable
                  />
                ))}
              </SubTypeBlock>
            ))}
          </AreaBlock>
        </Grid>
        <Grid
          container
          xs={12}
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
            xs={12}
            md={1}
            sx={(theme: Theme) => ({
              maxWidth: 230,
              [theme.breakpoints.down("md")]: {
                maxWidth: "100vw",
              },
            })}
          >
            <LevelCircle />
          </AreaBlock>
          <AreaBlock
            settable
            direction="down"
            xs={12}
            md={11}
            onWheel={(e: WheelEvent) => {
              // e.preventDefault();
              const container = e.currentTarget as HTMLDivElement;
              container.scrollLeft += e.deltaY;
            }}
          >
            <Box
              sx={{
                overflowX: "auto",
                overflowY: "hidden",
                width: "100%",
                display: "flex",
              }}
            >
              {_.map(skillList, (subType, type) => (
                <SubTypeBlock
                  key={`${type}`}
                  settable
                  xs={12}
                  sx={{
                    width: "fit-content",
                    height: "100%",
                    alignItems: "center",
                    flexShrink: 0,
                    pt: 3,
                  }}
                  direction="down"
                >
                  {_.map(subType, (item) => (
                    <Box
                      key={`${item.name}`}
                      sx={{ position: "relative", width: 100 }}
                    >
                      <SettingButton settable data={[]} />
                      <SkillCircular name={item.name} score={item.score} />
                    </Box>
                  ))}
                </SubTypeBlock>
              ))}
            </Box>
          </AreaBlock>
        </Grid>
      </Box>
    </div>
  );
}
