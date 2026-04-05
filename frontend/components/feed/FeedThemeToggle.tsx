"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function FeedThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="fixed right-1 top-1/2 -translate-y-1/2 z-50">
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="relative flex w-7 h-14 flex-col items-center justify-between rounded-full bg-[#1890FF] py-2 shadow-md transition-colors"
      >
        {/* The Sliding White Thumb */}
        <span
          className={`absolute top-[6px] left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-300 z-0
            ${isDark ? "translate-y-[26px]" : "translate-y-0"}`}
        />

        {/* The Icons (Fixed in the background) */}
        <span
          className={`relative z-10 transition-colors ${isDark ? "text-white" : "text-[#1890FF]"}`}
        >
          <Sun
            size={18}
            strokeWidth={1.5}
            className={!isDark ? "hidden" : ""}
          />
        </span>

        <span
          className={`relative z-10 transition-colors ${isDark ? "text-[#1890FF]" : "text-white"}`}
        >
          <Moon
            size={16}
            strokeWidth={1.5}
            className={!isDark ? "" : "hidden"}
          />
        </span>
      </button>
    </div>
  );
}
