import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProviderClient } from "./components/ThemeProviderClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EWSD Project",
  description: "EWSD Project using Zustand & Zod",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-base-100 text-base-content`}
        suppressHydrationWarning
      >
        <ThemeProviderClient>
          <ToastProvider>{children}</ToastProvider>
          <Analytics />
          <SpeedInsights />
        </ThemeProviderClient>
      </body>
    </html>
  );
}
