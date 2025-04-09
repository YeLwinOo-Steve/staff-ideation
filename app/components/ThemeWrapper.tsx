"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ThemeWrapper() {
  const { setTheme } = useTheme();

  useEffect(() => {
    // Only update theme if it's not already set
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (!currentTheme) {
      setTheme("lemonade");
    }
  }, [setTheme]);

  return null;
} 