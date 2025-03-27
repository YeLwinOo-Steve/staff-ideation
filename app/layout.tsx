import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";
import ThemeWrapper from "./themeWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EWSD Project",
  description: "EWSD Project using Zustand & Zod",
};

const ThemeProviderClient = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="lemonade"
      storageKey="data-theme"
      themes={["lemonade", "abyss"]}
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-base-100 text-base-content`}
        suppressHydrationWarning
      >
        <ThemeProviderClient>
          <ThemeWrapper />
          <ToastProvider>{children}</ToastProvider>
          <Analytics />
          <SpeedInsights />
        </ThemeProviderClient>
      </body>
    </html>
  );
}
