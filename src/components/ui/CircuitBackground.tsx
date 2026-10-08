"use client";

import React from "react";

export function CircuitBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden opacity-30 dark:opacity-20 ${className}`} aria-hidden="true">
      <svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="circuit-grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-circuit-line"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#circuit-grid-pattern)" />

        {/* Dynamic circuit traces */}
        <g fill="none" stroke="currentColor" strokeWidth="1.5" className="text-circuit-node">
          {/* Path 1: Top-left to Center */}
          <path
            d="M 0 120 L 180 120 L 240 180 L 480 180 L 520 220 L 700 220"
            strokeDasharray="4 4"
            className="animate-pulse-slow opacity-60"
          />
          <circle cx="180" cy="120" r="3" fill="currentColor" />
          <circle cx="240" cy="180" r="3" fill="currentColor" />
          <circle cx="520" cy="220" r="4" fill="currentColor" />

          {/* Path 2: Bottom-right to Center */}
          <path
            d="M 1200 680 L 1020 680 L 960 620 L 750 620 L 700 570 L 500 570"
            strokeDasharray="6 6"
            className="opacity-40"
          />
          <circle cx="1020" cy="680" r="3" fill="currentColor" />
          <circle cx="960" cy="620" r="3" fill="currentColor" />
          <circle cx="700" cy="570" r="4" fill="currentColor" />

          {/* Path 3: Branching IC bus */}
          <path
            d="M 300 0 L 300 120 L 360 180 L 360 360 L 420 420"
            className="opacity-50"
          />
          <circle cx="300" cy="120" r="3" fill="currentColor" />
          <circle cx="360" cy="180" r="3" fill="currentColor" />
          <circle cx="420" cy="420" r="5" fill="currentColor" />

          {/* Micro IC Chip representation */}
          <rect
            x="410"
            y="410"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="opacity-70"
          />
        </g>
      </svg>
    </div>
  );
}
