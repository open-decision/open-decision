import {
  slate,
  slateA,
  indigo,
  amber,
  indigoA,
  amberA,
  red,
  redA,
  green,
  greenA,
  blue,
  blueA,
  yellow,
  yellowA,
} from "@radix-ui/colors";
import { aliasColor, SystemColors } from "./utils";

export const space = {
  1: "8px",
  2: "16px",
  3: "24px",
  4: "32px",
  5: "40px",
  6: "48px",
  7: "56px",
  8: "64px",
  9: "128px",
  10: "256px",
} as const;

export const fontSizes = {
  base: "$md",
  xs: "0.75rem",
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
  xl: "1.625rem",
} as const;

export const zIndices = {
  auto: "auto",
  0: "0",
  10: "10",
  20: "20",
  30: "30",
  40: "40",
  50: "50",
} as const;

export const letterSpacings = {
  base: "$0",
  "-2": "-0.05em",
  "-1": "-0.025em",
  0: "0em",
  1: "0.025em",
  2: "0.05em",
  4: "0.1em",
} as const;

export const lineHeights = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2",
} as const;

export const shadows = {
  xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl:
    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  none: "none",
} as const;

export const fontWeights = {
  thin: "100",
  extralight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
} as const;

export const radii = {
  base: "$md",
  none: "0px",
  sm: "0.125rem",
  md: "0.25rem",
  lg: "0.375rem",
  xl: "0.5rem",
  "2xl": "0.75rem",
  "3xl": "1rem",
  "4xl": "1.5rem",
  full: "9999px",
} as const;

export const colors: SystemColors = {
  ...aliasColor("gray", slate),
  ...aliasColor("grayA", slateA),
  ...aliasColor("primary", indigo),
  ...aliasColor("primaryA", indigoA),
  ...aliasColor("accent", amber),
  ...aliasColor("accentA", amberA),
  ...aliasColor("error", red),
  ...aliasColor("errorA", redA),
  ...aliasColor("success", green),
  ...aliasColor("successA", greenA),
  ...aliasColor("warning", yellow),
  ...aliasColor("warningA", yellowA),
  ...aliasColor("info", blue),
  ...aliasColor("infoA", blueA),
};

export const media = {
  largePhone: "(min-width: 640px)",
  smallTablet: "(min-width: 768px)",
  largeTablet: "(min-width: 1024px)",
  laptop: "(min-width: 1280px)",
  desktop: "(min-width: 1500px)",
  animation: "(prefers-reduced-motion: no-preference)",
} as const;

export const mediaNumberOnly = {
  largePhone: "640px",
  smallTablet: "768px",
  largeTablet: "1024px",
  laptop: "1280px",
  desktop: "1500px",
} as const;

export const tokens = {
  space,
  fontSizes,
  zIndices,
  letterSpacings,
  lineHeights,
  shadows,
  fontWeights,
  radii,
  colors,
};
