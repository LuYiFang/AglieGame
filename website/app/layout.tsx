import type { ReactNode } from "react";
import { StoreProvider } from "./StoreProvider";

import "./styles/globals.css";
import styles from "./styles/layout.module.css";
import { GlobalStyles } from "@mui/material";

interface Props {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <StoreProvider>
      <GlobalStyles
        styles={{
          "*::-webkit-scrollbar": {
            width: 0,
            height: 0,
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "#4b6a91",
            borderRadius: 10,
          },
          "*::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "*:hover::-webkit-scrollbar": {
            height: 10,
            width: 10,
          },
          "*::-webkit-scrollbar-thumb:hover": {
            borderRadius: 10,
          },
        }}
      />
      <html lang="en">
        <body>
          <main className={styles.main}>{children}</main>
        </body>
      </html>
    </StoreProvider>
  );
}
