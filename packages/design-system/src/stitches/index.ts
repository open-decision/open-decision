import {
  createStitches,
  CSS,
  ScaleValue as StitchesScaleValue,
} from "@stitches/react";
import {
  slateDark,
  slateDarkA,
  indigoDark,
  indigoDarkA,
  amberDark,
  amberDarkA,
  redDark,
  redDarkA,
  greenDark,
  greenDarkA,
  blueDark,
  blueDarkA,
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
import { ColorKeys, aliasColor, TextStyles } from "../internal/utils";
import { Prefixed } from "@stitches/react/types/util";

export const designSystem = createStitches({
  theme: {
    colors: {
      ...aliasColor("gray", slate),
      ...aliasColor("grayA", slateA),
      ...aliasColor("primary", indigo),
      ...aliasColor("primaryA", indigoA),
      ...aliasColor("accent", amber, true),
      ...aliasColor("accentA", amberA, true),
      ...aliasColor("danger", red),
      ...aliasColor("dangerA", redA),
      ...aliasColor("success", green),
      ...aliasColor("successA", greenA),
      ...aliasColor("warning", amber, true),
      ...aliasColor("warningA", amberA, true),
      ...aliasColor("info", blue),
      ...aliasColor("infoA", blueA),
      black: "$colors$gray12",
      white: "$colors$gray1",
      shadowColor: "rgba(17, 24, 28, 0.1)",
      background: "$colors$gray1",
      colorScheme1: `$colors$gray1`,
      colorScheme2: `$colors$gray2`,
      colorScheme3: `$colors$gray3`,
      colorScheme4: `$colors$gray4`,
      colorScheme5: `$colors$gray5`,
      colorScheme6: `$colors$gray6`,
      colorScheme7: `$colors$gray7`,
      colorScheme8: `$colors$gray8`,
      colorScheme9: `$colors$gray9`,
      colorScheme10: `$colors$gray10`,
      colorScheme11: `$colors$gray11`,
      colorScheme12: `$colors$gray12`,
    },
    space: {
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
    },
    fontSizes: {
      "extra-large-heading": "4.5rem",
      "large-heading": "3rem",
      "medium-heading": "2rem",
      "small-heading": "1.5rem",
      "extra-small-heading": "1.25rem",
      "large-text": "1.125rem",
      "medium-text": "1rem",
      "small-text": "0.875rem",
      "extra-small-text": "0.75rem",
    },
    letterSpacings: {
      "extra-large-heading": "-0.012em",
      "large-heading": "- 0.012em",
      "medium-heading": "0",
      "small-heading": "0",
      "extra-small-heading": "0",
      "large-text": "0",
      "medium-text": "0",
      "small-text": "0",
      "extra-small-text": "0.04em",
    },
    lineHeights: {
      "extra-large-heading": "1.25em",
      "large-heading": "1.25em",
      "medium-heading": "1.25em",
      "small-heading": "1.25em",
      "extra-small-heading": "1.25em",
      "large-text": "1.5em",
      "medium-text": "1.5em",
      "small-text": "1.5em",
      "extra-small-text": "1.5em",
    },
    shadows: {
      1: "0px 1px 2px $colors$shadowColor",
      2: "0px 2px 4px $colors$shadowColor",
      3: "0px 3px 6px $colors$shadowColor",
      4: "0px 4px 8px $colors$shadowColor",
      5: "0px 5px 10px $colors$shadowColor",
      6: "0px 5px 15px $colors$shadowColor",
      7: "0px 5px 30px $colors$shadowColor",
      inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    },
    fontWeights: {
      "extra-large-heading": "700",
      "large-heading": "700",
      "medium-heading": "700",
      "small-heading": "700",
      "extra-small-heading": "600",
      "large-text": "400",
      "medium-text": "400",
      "small-text": "400",
      "extra-small-text": "400",
    },
    radii: {
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
    },
    zIndices: {
      0: "0",
      10: "10",
      20: "20",
      30: "30",
      40: "40",
      50: "50",
    },
    fonts: {
      sans: "-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, roboto, noto, arial, sans-serif;",
      serif:
        "Iowan Old Style, Apple Garamond, Baskerville, Times New Roman, Droid Serif, Times, Source Serif Pro, serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
      heading: "$sans",
      text: "$sans",
    },
  },
  media: {
    largePhone: "(min-width: 640px)",
    smallTablet: "(min-width: 768px)",
    largeTablet: "(min-width: 1024px)",
    laptop: "(min-width: 1280px)",
    desktop: "(min-width: 1500px)",
    animation: "(prefers-reduced-motion: no-preference)",
  },
  utils: {
    colorScheme: (value: ColorKeys) => ({
      "--colors-colorScheme1": `$colors$${value}1`,
      "--colors-colorScheme2": `$colors$${value}2`,
      "--colors-colorScheme3": `$colors$${value}3`,
      "--colors-colorScheme4": `$colors$${value}4`,
      "--colors-colorScheme5": `$colors$${value}5`,
      "--colors-colorScheme6": `$colors$${value}6`,
      "--colors-colorScheme7": `$colors$${value}7`,
      "--colors-colorScheme8": `$colors$${value}8`,
      "--colors-colorScheme9": `$colors$${value}9`,
      "--colors-colorScheme10": `$colors$${value}10`,
      "--colors-colorScheme11": `$colors$${value}11`,
      "--colors-colorScheme12": `$colors$${value}12`,
    }),
    colorFallback: (value: StitchesScaleValue<"colors"> | "inherit") => ({
      color: `var(--color, ${value})`,
    }),
    textStyle: (value: TextStyles | "inherit") => {
      const sharedTextStyles = {
        fontSize: `$${value}`,
        lineHeight: `$${value}`,
        letterSpacing: `$${value}`,
        fontWeight: `$${value}`,
      };

      const inheritStyles = {
        fontSize: "inherit",
        lineHeight: "inherit",
        letterSpacing: "inherit",
        fontWeight: "inherit",
        fontFamily: "inherit",
        colorFallback: "inherit",
      };

      switch (value) {
        case "extra-large-heading":
        case "large-heading":
        case "medium-heading":
        case "small-heading":
        case "extra-small-heading":
          return {
            fontFamily: "$heading",
            ...sharedTextStyles,
          };

        case "inherit":
          return inheritStyles;

        default:
          return { fontFamily: "$text", ...sharedTextStyles };
      }
    },
    focusStyle: (
      value: "inner-within" | "outer-within" | "outer" | "inner"
    ) => {
      switch (value) {
        case "outer":
        case "outer-within": {
          const focusWithin =
            value === "outer-within" ? "&:focus-within" : undefined;

          return {
            [`&:focus-visible, ${focusWithin}, &[data-focus='true']`]: {
              boxShadow:
                "0 0 0 1px $colors$background, 0 0 0 3px var(--focusColor, $colors$primary10)",
              borderColor: "$background",
              outline: "none",
            },
          };
        }

        default: {
          const focusWithin =
            value === "inner-within" ? "&:focus-within" : undefined;

          return {
            [`&:focus-visible, ${focusWithin}, &[data-focus='true']`]: {
              boxShadow: "inset 0 0 0 1px var(--focusColor, $colors$primary10)",
              borderColor: "var(--focusColor, $colors$primary10)",
              outline: "none",
            },
          };
        }
      }
    },
  },
});
export * from "@stitches/react";

export type StyleObject = CSS<typeof designSystem>;

export type ScaleValue<T> = StitchesScaleValue<T, typeof designSystem>;
type Theme = typeof theme;

type TokenByScaleName<ScaleName extends keyof Theme> = Prefixed<
  "$",
  keyof Theme[ScaleName]
>;

type ScaleVariant<ScaleName extends keyof Theme> = Record<
  keyof Theme[ScaleName],
  StyleObject
>;

type GetCss<ScaleName extends keyof Theme> = (
  token: TokenByScaleName<ScaleName>
) => StyleObject;

export function createScaleVariant<ScaleName extends keyof Theme>(
  scaleName: ScaleName,
  getCss: GetCss<ScaleName>
): ScaleVariant<ScaleName> {
  return Object.keys(designSystem.theme[scaleName]).reduce(
    (acc, key) => ({
      ...acc,
      [key]: getCss(`$${key}` as TokenByScaleName<ScaleName>),
    }),
    {} as any
  );
}

export const {
  styled,
  config,
  keyframes,
  css,
  globalCss,
  theme,
  createTheme,
  getCssText,
} = designSystem;

export const globalStyles = globalCss({
  "*, *::before, *::after": {
    boxSizing: "border-box",
  },
  "*": {
    margin: 0,
  },
  "html, body": {
    height: "100%",
  },
  body: {
    lineHeight: "1.5",
    WebkitFontSmoothing: "antialiased",
  },
  "img, picture, video, canvas, svg": {
    display: "block",
    maxWidth: "100%",
  },
  "input, button, textarea, select": {
    font: "inherit",
  },
  "p, h1, h2, h3, h4, h5, h6": {
    overflowWrap: "break-word",
  },
  "#root, #__next": {
    isolation: "isolate",
  },
});

export const darkTheme = createTheme("dark", {
  colors: {
    ...aliasColor("gray", slateDark),
    ...aliasColor("grayA", slateDarkA),
    ...aliasColor("primary", indigoDark),
    ...aliasColor("primaryA", indigoDarkA),
    ...aliasColor("accent", amberDark, true),
    ...aliasColor("accentA", amberDarkA, true),
    ...aliasColor("error", redDark),
    ...aliasColor("errorA", redDarkA),
    ...aliasColor("success", greenDark),
    ...aliasColor("successA", greenDarkA),
    ...aliasColor("warning", amberDark, true),
    ...aliasColor("warningA", amberDarkA, true),
    ...aliasColor("info", blueDark),
    ...aliasColor("infoA", blueDarkA),
    ...aliasColor("colorScheme", slateDark),
    black: "$colors$gray1",
    white: "$colors$gray12",
    background: "$colors$gray3",
  },
});
