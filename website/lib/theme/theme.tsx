"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1c2547b3",
      dark: "#1c2547e6",

      light: "#5088c899",
    },
    secondary: {
      main: "rgba(80, 136, 200, 0.6)", // 副要顏色
    },
    border: {
      main: "#80B0D8",
    },

    legendary: {
      main: "#b7471c",
    },
    rare: {
      main: "#1c77b7",
    },
    common: {
      main: "#959595",
    },

    // primary?: PaletteColorOptions;
    // secondary?: PaletteColorOptions;
    // error?: PaletteColorOptions;
    // warning?: PaletteColorOptions;
    // info?: PaletteColorOptions;
    // success?: PaletteColorOptions;
    //         light?: string;
    //   main: string;
    //   dark?: string;
    //   contrastText?: string;
  },
  components: {
    MuiGrid2: {
      styleOverrides: {
        root: {
          "::-webkit-scrollbar": {
            width: 0,
            height: 0,
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: "#4b6a91",
            borderRadius: 10,
          },
          "::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          ":hover::-webkit-scrollbar": {
            height: 10,
            width: 10,
          },
          "::-webkit-scrollbar-thumb:hover": {
            borderRadius: 10,
          },
        },
      },
    },
  },
  typography: {
    fontFamily: "var(--font-roboto)",
  },
});

export default theme;
