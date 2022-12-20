import { extendTailwindMerge } from "tailwind-merge";

const colorScales = [
  "gray",
  "primary",
  "accent",
  "danger",
  "success",
  "warning",
  "info",
  "colorScheme",
];

const textStyles = [
  "extra-large-heading",
  "large-heading",
  "medium-heading",
  "small-heading",
  "extra-small-heading",
  "large-text",
  "medium-text",
  "small-text",
  "extra-small-text",
];

export const twMerge = extendTailwindMerge({
  classGroups: {
    colorScheme: colorScales.map((scale) => `colorScheme-${scale}`),
    textStyles: textStyles,
    focusStyles: ["outer-focus", "inner-focus"],
  },
  conflictingClassGroups: {},
});

import type { ClassNameValue } from "tailwind-merge/dist/lib/tw-join";

export type { ClassNameValue };
