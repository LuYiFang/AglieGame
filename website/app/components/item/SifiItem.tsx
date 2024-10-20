import { Box, Button, IconButton, styled } from "@mui/material";
import _ from "lodash";
import { FC, useEffect, useMemo, useState } from "react";
import TextField from "../input/TextField";
import AddIcon from "@mui/icons-material/Add";
import ImageSelector from "../input/ImageSelector";
import { levelColorMap } from "@/lib/constants";
import { abilityListType } from "@/lib/types/user.types";

const SIZE = 100;

export const SiFiIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 0,
  backgroundColor: "transparent",
  color: "transparent",
  "&:hover": {
    backgroundColor: "rgba(106,129,163, 0.7)",
    color: "#fff",
  },
}));

export const SiFiBox = styled(Box)(({ theme }) => ({
  border: "1px solid #80B0D8",
  boxShadow: "0 0 5px #125585",
  backgroundColor: "rgba(28,37,71,0.9)",
}));

const circleColor = "#1c2547b3";

/* Copyright (c) 2024 by Dhana's Designs (https://codepen.io/Dhanasekarankd/pen/wvPKMXo)
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
export const SiFiItem: FC<{
  data: abilityListType;
  style?: { [key: string]: any };
  onUpdate?: (...args: any[]) => void;
}> = ({ data = {}, onUpdate = () => {} }) => {
  const [name, setName] = useState<string>(data.name);
  const [score, setScore] = useState<string>("0");
  const [open, setOpen] = useState<boolean>(false);

  const levelColor = useMemo(() => levelColorMap[data.level], [data.level]);

  useEffect(() => {
    setName(data.name);
  }, [data.name]);

  useEffect(() => {
    setScore(data.value);
  }, [data.value]);

  const openFileSelector = () => {
    setOpen(true);
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          alignItems: "center",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 300"
          shapeRendering="geometricPrecision"
          textRendering="geometricPrecision"
          height="110%"
          style={{
            minWidth: 80,
            zIndex: 1,
          }}
        >
          <g id="fireCircles">
            <g
              id="innerCircle"
              style={{ isolation: "isolate" }}
              transform="translate(.000001 0.000001)"
            >
              <path
                d="M104.5,245.5c50.522,20.662,110.307-1.715,133.5-49l-3.5-2C210.584,239.326,155.844,260.356,106,242l-1.5,3.5Z"
                fill={circleColor}
              />
              <path
                d="M50.9999,88C80.8853,41.3236,130.974,26.6843,178,41.5l1.5-3c-56.418-21.0141-113.3223,9.6264-132.0001,48l3.5,1.5Z"
                fill={circleColor}
              />
            </g>
            <g
              id="middleCircle"
              style={{ isolation: "isolate" }}
              transform="translate(0 0.000001)"
            >
              <path
                d="M109,269.5l3-10c-7.749-1.9-11.855-3.713-19.0001-7.5l-1.5,2c-29.7052-13.227-43.5219-26.425-61-59l3-1.5c-3.9435-5.961-4.9342-9.706-6.5-17l-10.5,4c1.4714,6.863,2.7194,10.693,5.5,17.5l3.5-1c17.6217,33.53,31.7616,46.358,62.5,61.5l-1,3c7.6774,4.415,12.4224,6.268,22.0001,8Z"
                fill={levelColor}
              />
              <path
                d="M179,258.5l3.5,9c-3.646,2-5.954,2.647-10.5,3l-3-9c0,0,6.437-1.018,10-3Z"
                fill={levelColor}
              />
              <path
                d="M199.5,250.5c3.78-2.096,5.647-3.3,8.5-5.5l5.5,7.5c-3.068,2.6-5.187,3.897-9.5,6l-4.5-8Z"
                fill={levelColor}
              />
              <path
                d="M72.9999,31l8.5-6l5.5,9.5-9.5,5.5-4.5-9Z"
                fill={levelColor}
              />
              <path d="M103,16l8.5-3l4.5,9-9,3-4-9Z" fill={levelColor} />
              <path
                d="M176,14l-1.5,11c8.199,2.3423,12.122,4.1035,19,7l1.5-2.5c31.337,16.0454,44.302,29.1144,60,59L252.5,90l6.5,15.5l9.5-3-6-16.5-3.5,1c-15.528-31.9354-28.84-45.3346-61-61l1-3.5c-8.177-3.8579-13.061-5.8207-23-8.5Z"
                fill={levelColor}
              />
              <path
                d="M184,256.5c4.077-1.132,6.255-2.039,10-4l5,9c-4.586,2.635-6.882,3.613-10.5,4.5l-4.5-9.5Z"
                fill={circleColor}
              />
              <path
                d="M260.5,110l9.5-2l2.5,11-2,.5c4.748,37.045,1.315,55.991-15.5,86.5l2,1.5c-12.554,19.169-21.128,28.706-38.5,42.5l-6-8c16.333-13.187,24.086-21.735,35.5-39l2,1c15.341-30.546,18.481-48.774,15-83.5h-3L260.5,110Z"
                fill={circleColor}
              />
              <path
                d="M66.4999,34.5l6.5,8.5c-17.7313,12.102-25.1695,20.785-35.5,38.5l-2.1092-1.4431C19.2746,111.452,16.3387,129.788,19.4999,163.5l2.5-.5l3.5,9.5-10,4-3.5-11l2.5-2c-3.8095-35.625.279-54.466,16.5-86.4474l-3-2.0526c12.5326-17.2092,20.8653-26.1302,38.5-40.5Z"
                fill={circleColor}
              />
              <path
                d="M86.9999,22l9-4L101.5,27l-9.0001,5-5.5-10Z"
                fill={circleColor}
              />
              <path
                d="M176,14c-22.255-5.11265-34.544-5.86404-56-2l1,10c20.521-3.729,32.63-2.2006,53.5,3L176,14Z"
                fill={circleColor}
              />
              <path
                d="M165.5,271.5l-1-9c-23.852,2.063-35.778,1.823-52.5-3l-3,10c21.165,4.224,33.503,5.253,56.5,2Z"
                fill={circleColor}
              />
            </g>
            <g id="outerCircle" style={{ isolation: "isolate" }}>
              <path
                d="M155.619,0.499987h-13.119v3.000013c65.793-1.71862,126.834,46.1367,137,114l2.75-.5l2.75-.5C272.536,56.6375,227.189,8.8461,165.971,1.36836c-3.403-.415602-6.854-.706677-10.352-.868373Z"
                fill={circleColor}
              />
              <path
                d="M5.49988,166l-5.000002,1C16.6159,242.886,74.7505,285.685,142.5,285.5v-2-.5-2.5C68.1241,278.908,21.0245,234.302,5.49988,166Z"
                fill={circleColor}
              />
            </g>
          </g>

          <defs>
            <clipPath id="circleView">
              <circle cx="100" cy="100" r="100" />
            </clipPath>
          </defs>
          <ImageSelector
            defaultImg={data.img}
            open={open}
            onClose={() => setOpen(false)}
            onSave={(fileUrl) => onUpdate({ img: fileUrl })}
            tagType="svg"
            imgProps={{
              transform: "translate(45 42)",
              height: "200",
              width: "200",
              clipPath: "url(#circleView)",
              onDoubleClick: openFileSelector,
            }}
          />
        </svg>
        <div style={{ marginLeft: "0.5rem", marginRight: "2rem" }}>
          <TextField
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              onUpdate({ name: e.target.value });
            }}
            sx={{
              width: "100%",
              zIndex: 2,
              fontSize: (SIZE * 35) / 180,
              fontWeight: "bold",
              color: "#e9e9e9",
              letterSpacing: 1,
              paddingBottom: "10px",
              paddingRight: 2,
              // marginLeft: 2,
              marginRight: 1,
            }}
            inputProps={{
              style: {
                textAlign: "start",
              },
            }}
          />

          <Box
            sx={{
              width: "100%",
              height: 6,
              backgroundColor: circleColor,
              position: "relative",
              borderRadius: "2px",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#fff",
                width: `${score}%`,
                height: "100%",
                transition: "width 2s ease",
                position: "absolute",
                left: 0,
                borderRadius: "2px",
              }}
            />
          </Box>
        </div>

        <svg
          viewBox="0 0 1036 300"
          shapeRendering="geometricPrecision"
          textRendering="geometricPrecision"
          style={{
            position: "absolute",
            height: "100%",
            right: 5,
            zIndex: 0,
          }}
        >
          <g id="container" style={{ isolation: "isolate" }}>
            <path
              id="containerRightBottom"
              d="M1034.5,108h-2l-.5,67c-3.32,8.487-5.85,12.783-11,20l-72.5,72.5c-8.257,7.176-13.852,10.104-25,14h-66v2v2.5l66-.5c13.323-4.081,19.832-7.941,29.5-18l72-72.5c5.51-7.215,7.93-11.591,11-20v-67h-1.5Z"
              fill={circleColor}
            />
            <path
              id="containerRightTop"
              d="M967,0v2h53c10.24,2.15585,13.04,5.37166,13,14.5v25.25v25.25h1.5h1.5v-50.5c-.49-12.43488-4.12-15.921665-16-16.5h-53Z"
              transform="translate(0 2)"
              fill={circleColor}
            />
          </g>
        </svg>
      </div>
    </>
  );
};

export const SifiAddButton: FC<{
  direction: string | undefined;
  onAdd: (...args: any[]) => void;
}> = ({ direction, onAdd }) => {
  return (
    <>
      <Button
        sx={{
          p: 0,
          position: "absolute",
          ...((!direction || direction === "up") && {
            height: "12px",
            bottom: -4,
            left: 0,
            right: 0,
          }),
          ...(direction == "down" && {
            width: "12px",
            bottom: 0,
            top: 0,
            right: -4,
            minWidth: "12px",
          }),
          backgroundColor: "transparent",
          color: "transparent",
          borderStyle: "solid",
          borderColor: "transparent",
          borderWidth: 1,
          "&:hover": {
            backgroundColor: "rgba(106,129,163, 0.7)",
            color: "#222B4C",
            borderStyle: "solid",
            borderColor: "rgba(255,255,255)",
            "& > *": {
              display: "block",
            },
          },
        }}
        onClick={onAdd}
      >
        <Box
          sx={{
            backgroundColor: "rgba(255,255,255)",
            borderStyle: "solid",
            borderColor: "rgba(255,255,255)",
            borderRadius: "50%",
            height: 20,
            width: 20,
            display: "none",
            zIndex: 2,
          }}
        >
          <AddIcon
            sx={{
              height: "0.8em",
              width: "0.8em",
            }}
          />
        </Box>
      </Button>
    </>
  );
};
