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
import { aliasColor, TextStyles, SystemColors } from "./utils";

export const space = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  9: "48px",
  10: "64px",
  11: "96px",
  12: "128px",
} as const;

export const fontSizes: Record<TextStyles, string> = {
  "large-heading": "1.625rem",
  "medium-heading": "1.25rem",
  "small-heading": "1rem",
  "extra-small-heading": "0.875rem",
  button: "1rem",
  badge: "0.75rem",
  overline: "0.875rem",
  "large-text": "1.125rem",
  "medium-text": "1rem",
  "small-text": "0.875rem",
  caption: "0.75rem",
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

export const letterSpacings: Record<TextStyles, string> = {
  "large-heading": "0.012em",
  "medium-heading": "0",
  "small-heading": "0",
  "extra-small-heading": "0.01em",
  button: "0.025em",
  badge: "0.08em",
  overline: "0.035em",
  "large-text": "0",
  "medium-text": "0",
  "small-text": "0",
  caption: "0.04em",
} as const;

export const lineHeights: Record<TextStyles, string> = {
  "large-heading": "1.25em",
  "medium-heading": "1.2em",
  "small-heading": "1.5em",
  "extra-small-heading": "1.75em",
  button: "1.5em",
  badge: "1.3em",
  overline: "1.75em",
  "large-text": "1.3em",
  "medium-text": "1.5em",
  "small-text": "1.15em",
  caption: "1.3em",
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
  "large-heading": "600",
  "medium-heading": "600",
  "small-heading": "600",
  "extra-small-heading": "600",
  button: "500",
  badge: "600",
  overline: "500",
  "large-text": "400",
  "medium-text": "400",
  "small-text": "400",
  caption: "400",
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
