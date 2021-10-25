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
  "extra-large-heading": "4.5rem",
  "large-heading": "3rem",
  "medium-heading": "2rem",
  "small-heading": "1.5rem",
  "extra-small-heading": "1.25rem",
  "large-text": "1.125rem",
  "medium-text": "1rem",
  "small-text": "0.875rem",
  "extra-small-text": "0.75rem",
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
  "extra-large-heading": "-0.012em",
  "large-heading": "- 0.012em",
  "medium-heading": "0",
  "small-heading": "0",
  "extra-small-heading": "0",
  "large-text": "0",
  "medium-text": "0",
  "small-text": "0",
  "extra-small-text": "0.04em",
} as const;

export const lineHeights: Record<TextStyles, string> = {
  "extra-large-heading": "1.25em",
  "large-heading": "1.25em",
  "medium-heading": "1.25em",
  "small-heading": "1.25em",
  "extra-small-heading": "1.25em",
  "large-text": "1.5em",
  "medium-text": "1.5em",
  "small-text": "1.5em",
  "extra-small-text": "1.5em",
} as const;

export const shadows = {
  1: "0px 1px 2px $colors$shadowColor",
  2: "0px 2px 4px $colors$shadowColor",
  3: "0px 3px 6px $colors$shadowColor",
  4: "0px 4px 8px $colors$shadowColor",
  5: "0px 5px 10px $colors$shadowColor",
  6: "0px 5px 15px $colors$shadowColor",
  7: "0px 5px 30px $colors$shadowColor",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
} as const;

export const fontWeights: Record<TextStyles, string> = {
  "extra-large-heading": "700",
  "large-heading": "700",
  "medium-heading": "700",
  "small-heading": "700",
  "extra-small-heading": "600",
  "large-text": "400",
  "medium-text": "400",
  "small-text": "400",
  "extra-small-text": "400",
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
  ...aliasColor("accent", amber, true),
  ...aliasColor("accentA", amberA, true),
  ...aliasColor("error", red),
  ...aliasColor("errorA", redA),
  ...aliasColor("success", green),
  ...aliasColor("successA", greenA),
  ...aliasColor("warning", amber, true),
  ...aliasColor("warningA", amberA, true),
  ...aliasColor("info", blue),
  ...aliasColor("infoA", blueA),
  black: "$colors$gray12",
  white: "$colors$gray1",
  shadowColor: "rgba(17, 24, 28, 0.3)",
  background: "$colors$gray1",
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
