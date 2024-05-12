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
import { AreaBlock, SubTypeBlock } from "@/components/block/UserBlock";
import {
  eqpList,
  personality,
  polarData,
  qualityList,
  skillList,
} from "@/utilities/fakeData";
import SkillCircular from "@/components/Circular/SkillCircular";
import { Equipment, LevelCircle, Quality } from "@/components/item/userItem";
import Grid from "@/components/block/Grid";

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
          <AreaBlock container settable xs={12} md={3}>
            {_.map(eqpList, (eqps, type) => (
              <SubTypeBlock key={`${type}`} xs={12} settable direction="down">
                {_.map(eqps, (eqp) => (
                  <Equipment key={`${eqp.name}`} name={eqp.name} settable />
                ))}
              </SubTypeBlock>
            ))}
          </AreaBlock>
          <AreaBlock xs={12} md={6} settable direction="down">
            <Box
              sx={(theme) => ({
                backgroundColor: "white",
                width: "100%",
                height: "100%",
                [theme.breakpoints.down("md")]: {
                  height: 500,
                },
              })}
            ></Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              {_.map(personality, (v) => {
                return (
                  <Box key={v} sx={{ position: "relative" }}>
                    <SettingButton settable actionType="item" />
                    <Chip
                      label={v}
                      // size="80"
                      variant="outlined"
                      sx={{
                        mr: "2px",
                        borderRadius: 0,
                        fontSize: 16,
                        height: 48,
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
              <SettingButton settable />
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
            minHeight: "200px",
            maxHeight: "200px",
            [theme.breakpoints.down("md")]: {
              maxHeight: "500px",
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
          <AreaBlock settable direction="down" xs={12} md={11}>
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
                      <SettingButton settable />
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
