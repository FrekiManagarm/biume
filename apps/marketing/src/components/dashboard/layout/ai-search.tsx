"use client";

import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";

interface AISearchProps {
  onOpen: () => void;
}

export function AISearch({ onOpen }: AISearchProps) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpen();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onOpen]);

  const isMac = useMemo(() => {
    return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  }, [navigator.platform]);

  return (
    <Button
      variant="outline"
      className="group relative h-9 w-full justify-start rounded-lg bg-card text-sm shadow-none transition-colors hover:bg-linear-to-r hover:from-purple-50/30 hover:via-pink-50/30 hover:to-orange-50/30 dark:hover:from-purple-950/20 dark:hover:via-pink-950/20 dark:hover:to-orange-950/20 sm:pr-12 md:w-40 lg:w-46"
      onClick={onOpen}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2 transition-all"
      >
        <defs>
          <linearGradient
            id="sparkles-gradient-search"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor="rgb(147 51 234)"
              stopOpacity="0.8"
              className="transition-all group-hover:[stop-opacity:1]"
            />
            <stop
              offset="50%"
              stopColor="rgb(219 39 119)"
              stopOpacity="0.8"
              className="transition-all group-hover:[stop-opacity:1]"
            />
            <stop
              offset="100%"
              stopColor="rgb(249 115 22)"
              stopOpacity="0.8"
              className="transition-all group-hover:[stop-opacity:1]"
            />
          </linearGradient>
        </defs>
        <path
          d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.583a.5.5 0 0 1 0 .96L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
          fill="url(#sparkles-gradient-search)"
        />
        <path
          d="M20 3v4M22 5h-4M6 21v-3M4 19h4"
          stroke="url(#sparkles-gradient-search)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="hidden bg-linear-to-r from-purple-600/80 via-pink-600/80 to-orange-600/80 bg-clip-text text-transparent transition-all group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-orange-600 lg:inline-flex">
        Mon assistant
      </span>
      <span className="inline-flex bg-linear-to-r from-purple-600/80 via-pink-600/80 to-orange-600/80 bg-clip-text text-transparent transition-all group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-orange-600 lg:hidden">
        Mon assistant
      </span>
      <Kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden sm:flex">
        <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>K
      </Kbd>
    </Button>
  );
}
