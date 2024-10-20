import { Box, Theme, TextField, Chip, Typography } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const HealthBar = forwardRef((props, ref) => {
  const [health, setHealth] = useState(50);
  const [color, setColor] = useState("rgba(28,37,71,0.9)");

  useImperativeHandle(ref, () => ({
    add: () => {
      setHealth(health + 10);
    },
    decrease: () => {
      setHealth(health - 10);
    },
  }));

  useEffect(() => {
    if (health > 20) return;
    setColor("#ff0023");
  }, [health]);

  return (
    <>
      <Box
        sx={{
          height: 12,
          backgroundColor: "#ddd",
          borderRadius: "2px",
          ...(props.sx || {}),
        }}
      >
        <Box
          sx={{
            backgroundColor: color,
            borderRadius: "2px",
            width: `${health}%`,
            height: "100%",
            transition: "width 2s ease",
          }}
        />
      </Box>
    </>
  );
});
export default HealthBar;
