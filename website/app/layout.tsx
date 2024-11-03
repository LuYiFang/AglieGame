import type { ReactNode } from "react";
import { StoreProvider } from "./StoreProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

import "./styles/globals.css";
import styles from "./styles/layout.module.css";
import { GlobalStyles, ThemeProvider } from "@mui/material";
import theme from "@/lib/theme/theme";

interface Props {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <StoreProvider>
      <html lang="en">
        <body>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <main className={styles.main}>{children}</main>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </body>
      </html>
    </StoreProvider>
  );
}
