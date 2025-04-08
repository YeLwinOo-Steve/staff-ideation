"use client";

import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";

export const ThemeProviderClient = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="lemonade"
      storageKey="data-theme"
      themes={["lemonade", "night"]}
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};
