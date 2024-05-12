import { useRef, useEffect, FC } from "react";
import { styled } from "@mui/material/styles";
import _ from "lodash";
import { Box, Typography } from "@mui/material";

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
  backgroundColor: "#292929",
  boxShadow: `0 0 ${(SIZE * 5) / 180}px ${(SIZE * 3) / 180}px #222121`,
  "&::before": {
    position: "absolute",
    content: '""',
    width: `calc(100% + ${(SIZE * 28) / 180}px)`,
    height: `calc(100% + ${(SIZE * 28) / 180}px)`,
    borderRadius: "50%",
    border: "1px solid #353535",
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
    backgroundColor: "#b7b5b5",
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
  name: string;
  score: number;
}> = (props) => {
  const { name, score } = props;

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

      circle.style.strokeDashoffset = `${strokeDashoffset - strokeDashoffset * (score / 100)}`;
      dots.style.transform = `rotate(${360 * (score / 100)}deg)`;
      if (score == 100) {
        dots.style.opacity = "0";
      }
    };

    runCircle();
  }, []);

  return (
    <Box sx={{ maxWidth: SIZE }}>
      <Block>
        <Edge>
          <p className="number">
            <span
              style={{
                fontSize: (SIZE * 35) / 180,
                fontWeight: "bold",
                color: "#e9e9e9",
              }}
            >
              {score}
            </span>
            <span style={{ fontSize: (SIZE * 20) / 180, color: "#e9e9e9" }}>
              %
            </span>
          </p>
        </Edge>
        <Dot ref={dotsRef}></Dot>
        <Svg>
          <defs>
            <linearGradient id="gradientStyle">
              <stop offset="0%" stopColor="#565656" />
              <stop offset="100%" stopColor="#b7b5b5" />
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
      <Typography noWrap>{name}</Typography>
    </Box>
  );
};
export default SkillCircular;
