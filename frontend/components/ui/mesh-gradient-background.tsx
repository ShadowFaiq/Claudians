"use client";

import { useId, useRef } from "react";
import { motion, useAnimationFrame, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type MeshGradientBackgroundProps = {
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

const blobTimings = [18, 22, 26, 30, 16];

export function MeshGradientBackground({
  children,
  className,
  contentClassName,
}: MeshGradientBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const filterId = useId();
  const grainFilterId = useId();

  useAnimationFrame((t) => {
    if (reduceMotion) {
      return;
    }

    const phase = t / 5000;
    const baseFrequency = 0.00425 + Math.sin(phase) * 0.00075;
    const displacement = 30 + Math.cos(phase * 0.6) * 4;

    turbulenceRef.current?.setAttribute("baseFrequency", baseFrequency.toFixed(5));
    displacementRef.current?.setAttribute("scale", displacement.toFixed(2));
  });

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden",
        "bg-[linear-gradient(135deg,#FFFFFF_0%,#EEF2FF_46%,#F5F3FF_100%)]",
        "dark:bg-[linear-gradient(135deg,#020617_0%,#0F0A1E_48%,#0A0A0F_100%)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <svg className="h-full w-full" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
              <feTurbulence
                ref={turbulenceRef}
                type="fractalNoise"
                baseFrequency="0.00425"
                numOctaves="2"
                seed="11"
                result="noise"
              />
              <feDisplacementMap
                ref={displacementRef}
                in="SourceGraphic"
                in2="noise"
                scale="30"
                xChannelSelector="R"
                yChannelSelector="B"
              />
            </filter>

            <radialGradient id={`${filterId}-light-1`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C7D2FE" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${filterId}-light-2`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${filterId}-light-3`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${filterId}-light-4`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#A5F3FC" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#A5F3FC" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${filterId}-light-5`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#E0E7FF" stopOpacity="0" />
            </radialGradient>

            <radialGradient id={`${filterId}-dark-1`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3730A3" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3730A3" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${filterId}-dark-2`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4C1D95" stopOpacity="0.78" />
              <stop offset="100%" stopColor="#4C1D95" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${filterId}-dark-3`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0C4A6E" stopOpacity="0.78" />
              <stop offset="100%" stopColor="#0C4A6E" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${filterId}-dark-4`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#164E63" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#164E63" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${filterId}-dark-5`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g filter={`url(#${filterId})`} className="dark:hidden">
            <motion.ellipse
              cx="190"
              cy="180"
              rx="300"
              ry="240"
              fill={`url(#${filterId}-light-1)`}
              animate={reduceMotion ? undefined : { cx: [190, 290, 230], cy: [180, 120, 210] }}
              transition={{ duration: blobTimings[0], repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            />
            <motion.ellipse
              cx="880"
              cy="220"
              rx="320"
              ry="250"
              fill={`url(#${filterId}-light-2)`}
              animate={reduceMotion ? undefined : { cx: [880, 760, 920], cy: [220, 280, 210] }}
              transition={{ duration: blobTimings[1], repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            />
            <motion.ellipse
              cx="570"
              cy="440"
              rx="340"
              ry="280"
              fill={`url(#${filterId}-light-3)`}
              animate={reduceMotion ? undefined : { cx: [570, 520, 670], cy: [440, 360, 500] }}
              transition={{ duration: blobTimings[2], repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            />
            <motion.ellipse
              cx="260"
              cy="690"
              rx="300"
              ry="230"
              fill={`url(#${filterId}-light-4)`}
              animate={reduceMotion ? undefined : { cx: [260, 340, 200], cy: [690, 630, 730] }}
              transition={{ duration: blobTimings[3], repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            />
            <motion.ellipse
              cx="980"
              cy="650"
              rx="340"
              ry="250"
              fill={`url(#${filterId}-light-5)`}
              animate={reduceMotion ? undefined : { cx: [980, 890, 1010], cy: [650, 730, 600] }}
              transition={{ duration: blobTimings[4], repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            />
          </g>

          <g filter={`url(#${filterId})`} className="hidden dark:block">
            <motion.ellipse
              cx="210"
              cy="170"
              rx="320"
              ry="250"
              fill={`url(#${filterId}-dark-1)`}
              animate={reduceMotion ? undefined : { cx: [210, 320, 250], cy: [170, 120, 230] }}
              transition={{ duration: blobTimings[0], repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            />
            <motion.ellipse
              cx="870"
              cy="230"
              rx="330"
              ry="260"
              fill={`url(#${filterId}-dark-2)`}
              animate={reduceMotion ? undefined : { cx: [870, 760, 930], cy: [230, 300, 190] }}
              transition={{ duration: blobTimings[1], repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            />
            <motion.ellipse
              cx="600"
              cy="470"
              rx="350"
              ry="290"
              fill={`url(#${filterId}-dark-3)`}
              animate={reduceMotion ? undefined : { cx: [600, 520, 700], cy: [470, 380, 520] }}
              transition={{ duration: blobTimings[2], repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            />
            <motion.ellipse
              cx="260"
              cy="700"
              rx="300"
              ry="220"
              fill={`url(#${filterId}-dark-4)`}
              animate={reduceMotion ? undefined : { cx: [260, 330, 210], cy: [700, 620, 740] }}
              transition={{ duration: blobTimings[3], repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            />
            <motion.ellipse
              cx="990"
              cy="670"
              rx="340"
              ry="260"
              fill={`url(#${filterId}-dark-5)`}
              animate={reduceMotion ? undefined : { cx: [990, 900, 1040], cy: [670, 740, 610] }}
              transition={{ duration: blobTimings[4], repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            />
          </g>
        </svg>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,rgba(255,255,255,0.40)_0%,rgba(255,255,255,0)_48%)] dark:bg-[radial-gradient(circle_at_40%_30%,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0)_48%)]" />

        <svg className="absolute inset-0 h-full w-full mix-blend-overlay opacity-[0.035] dark:opacity-[0.07]" aria-hidden="true">
          <defs>
            <filter id={grainFilterId}>
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter={`url(#${grainFilterId})`} />
        </svg>
      </div>

      <div className={cn("relative z-10", contentClassName)}>{children}</div>
    </div>
  );
}
