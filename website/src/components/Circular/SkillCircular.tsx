import { useRef, useEffect, FC, useState } from "react";
import { styled } from "@mui/material/styles";
import _ from "lodash";
import { Box, IconButton, Typography } from "@mui/material";
import TextField from "../input/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import { SiFiIconButton } from "../item/SifiItem";

const SIZE = 100;
const strokeDashoffset = (SIZE * 503) / 180;

const Block = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: SIZE,
  height: SIZE,
  borderRadius: "50%",
}));

const Edge = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  width: `calc(100% - ${(SIZE * 50) / 180}px)`,
  height: `calc(100% - ${(SIZE * 50) / 180}px)`,
  borderRadius: "50%",
  backgroundColor: "#1c2547b3",
  boxShadow: `0 0 ${(SIZE * 5) / 180}px ${(SIZE * 3) / 180}px #507b9b`,
  "&::before": {
    position: "absolute",
    content: '""',
    width: `calc(100% + ${(SIZE * 28) / 180}px)`,
    height: `calc(100% + ${(SIZE * 28) / 180}px)`,
    borderRadius: "50%",
    border: "1px solid #13294a",
  },
}));

const Dot = styled("span")(({ theme }) => ({
  display: "block",
  position: "absolute",
  zIindex: 2,
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  transition: "2s transform, 2s opacity ease",
  "&::after": {
    position: "absolute",
    content: '""',
    width: (SIZE * 10) / 180,
    height: (SIZE * 10) / 180,
    top: (SIZE * 5) / 180,
    left: "50%",
    borderRadius: "50%",
    backgroundColor: "#fff",
    boxShadow: `0 0 ${(SIZE * 5) / 180}px ${(SIZE * 2) / 180}px #585858`,
    transform: "translateX(-50%)",
  },
}));

const Svg = styled("svg")(({ theme }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  fill: "none",
  transform: "rotate(-90deg)",
}));

const Circle = styled("circle")(({ theme }) => ({
  stroke: "url(#gradientStyle)",
  strokeWidth: (SIZE * 4) / 180,
  strokeDasharray: strokeDashoffset,
  strokeDashoffset: strokeDashoffset,
  animationDuration: "2s",
  animationTimingFunction: "linear",
  animationFillMode: "forwards",
  transition: "2s stroke-dashoffset",
}));

const SkillCircular: FC<{
  name?: string;
  score?: number | string;
  onDelete?: (...args: any[]) => void;
  onUpdate?: (...args: any[]) => void;
}> = (props) => {
  const {
    name: defaultName = "",
    score: defaultScore = 0,
    onDelete = () => {},
    onUpdate = () => {},
  } = props;

  const [name, setName] = useState<string>(defaultName);
  const [score, setScore] = useState<number>(
    parseInt(`${defaultScore}`) as number,
  );

  const circleRef = useRef<SVGCircleElement | null>(null);
  const dotsRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const circle = circleRef.current;
    const dots = dotsRef.current;

    if (!circle) return;
    if (!dots) return;

    const runCircle = () => {
      let count = 0;
      let time = 2000 / score;

      setInterval(() => {
        if (count == score) {
          clearInterval(undefined);
        } else {
          count += 1;
        }
      }, time);

      circle.style.strokeDashoffset = `${
        strokeDashoffset - strokeDashoffset * (score / 100)
      }`;
      dots.style.transform = `rotate(${360 * (score / 100)}deg)`;
      if (score == 100) {
        dots.style.opacity = "0";
      }
    };

    runCircle();
  }, [score]);

  return (
    <Box sx={{ maxWidth: SIZE, position: "relative", width: 100 }}>
      <IconButton
        onClick={onDelete}
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          zIndex: 1,
          backgroundColor: "transparent",
          color: "transparent",
          "&:hover": {
            backgroundColor: "rgba(106,129,163, 0.7)",
            color: "#fff",
          },
        }}
      >
        <ClearIcon />
      </IconButton>
      <Block>
        <Edge>
          <div
            style={{
              padding: 10,
              display: "flex",
            }}
          >
            <TextField
              type="number"
              value={score}
              onChange={(e) => {
                setScore(parseInt(e.target.value));
                onUpdate(null, e.target.value);
              }}
              sx={{
                zIndex: 2,
                fontSize: (SIZE * 35) / 180,
                fontWeight: "bold",
                color: "#e9e9e9",
                "& ::-webkit-outer-spin-button": {
                  "-webkit-appearance": "none",
                  margin: 0,
                },
                "& ::-webkit-inner-spin-button": {
                  "-webkit-appearance": "none",
                  margin: 0,
                },
              }}
              inputProps={{
                style: {
                  textAlign: "center",
                },
              }}
            />
            <span
              style={{
                fontSize: (SIZE * 20) / 180,
                color: "#e9e9e9",
                paddingTop: 8,
              }}
            >
              %
            </span>
          </div>
        </Edge>
        <Dot ref={dotsRef}></Dot>
        <Svg>
          <defs>
            <linearGradient id="gradientStyle">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#8793B8" />
            </linearGradient>
          </defs>
          <Circle
            ref={circleRef}
            cx={(SIZE * 90) / 180}
            cy={(SIZE * 90) / 180}
            r={(SIZE * 80) / 180}
          />
        </Svg>
      </Block>
      <TextField
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          onUpdate(e.target.value, null);
        }}
        inputProps={{
          style: {
            textAlign: "center",
            color: "#fff",
            fontWeight: 550,
            paddingRight: 4,
            paddingLeft: 4,
          },
        }}
      />
    </Box>
  );
};
export default SkillCircular;
