"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeWrapper() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && resolvedTheme) {
      document.documentElement.setAttribute("data-theme", resolvedTheme);
    }
  }, [mounted, resolvedTheme]);

  return null;
}
