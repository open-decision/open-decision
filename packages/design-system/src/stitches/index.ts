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
  grassDark,
  grassDarkA,
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
  grass,
  grassA,
  blue,
  blueA,
} from "@radix-ui/colors";
import {
  ColorKeys,
  aliasColor,
  TextStyles,
  SystemColors,
} from "../internal/utils";
import { outerFocusStyle, innerFocusStyle } from "./focusStyles";
import { focusSelector } from "./stateSelectors";

type focusTypes =
  | "inner-within"
  | "outer-within"
  | "outer"
  | "inner"
  | "outer-intent"
  | "inner-intent"
  | "none";

export const designSystem = createStitches({
  theme: {
    border: { layer: "1px solid $colors$gray5" },
    colors: {
      ...aliasColor("gray", slate, true),
      ...aliasColor("grayA", slateA, true),
      ...aliasColor("primary", indigo),
      ...aliasColor("primaryA", indigoA),
      ...aliasColor("accent", amber, true),
      ...aliasColor("accentA", amberA, true),
      ...aliasColor("danger", red),
      ...aliasColor("dangerA", redA),
      ...aliasColor("success", grass),
      ...aliasColor("successA", grassA),
      ...aliasColor("warning", amber, true),
      ...aliasColor("warningA", amberA, true),
      ...aliasColor("info", blue),
      ...aliasColor("infoA", blueA),
      ...aliasColor("colorScheme", slate, true),
      black: "$colors$gray12",
      white: "#ffffff",
      shadowColor: "rgba(17, 24, 28, 0.1)",
      layer1: "$white",
      layer2: "$gray1",
      layer3: "$gray2",
      layer4: "$gray3",
      layer5: "$gray6",
      focusColor: "$colors$primary10",
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
      "extra-large-heading": "3rem",
      "large-heading": "2rem",
      "medium-heading": "1.5rem",
      "small-heading": "1.125rem",
      "extra-small-heading": "1rem",
      "large-text": "1rem",
      "medium-text": "0.875rem",
      "small-text": "0.75rem",
      "extra-small-text": "0.625rem",
    },
    letterSpacings: {
      "extra-large-heading": "0",
      "large-heading": "0",
      "medium-heading": "0",
      "small-heading": "0",
      "extra-small-heading": "0",
      "large-text": "0",
      "medium-text": "0",
      "small-text": "0",
      "extra-small-text": "0.02em",
    },
    lineHeights: {
      "extra-large-heading": "1.15em",
      "large-heading": "1.25em",
      "medium-heading": "1.3em",
      "small-heading": "1.3em",
      "extra-small-heading": "1.25em",
      "large-text": "1.5em",
      "medium-text": "1.4em",
      "small-text": "1.3em",
      "extra-small-text": "1.6em",
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
    focusType: (value: focusTypes) => {
      const focusWithin = value.includes("within")
        ? "&:focus-within"
        : undefined;
      const focusOnIntent = value.includes("intent") ? "&:hover" : undefined;

      switch (value) {
        case "none": {
          return { outline: "none" };
        }
        case "outer":
        case "outer-within": {
          return {
            [`${focusSelector}, ${focusWithin}, ${focusOnIntent}`]:
              outerFocusStyle,
          };
        }

        default: {
          return {
            [`${focusSelector}, ${focusWithin}, ${focusOnIntent}`]:
              innerFocusStyle,
          };
        }
      }
    },
    focusColor: (value: `$${keyof SystemColors}`) => ({
      $colors$focusColor: `$colors${value}`,
    }),
    colorFallback: (value: `$${keyof SystemColors}`) => ({
      color: `var(--color, $colors${value})`,
    }),
    groupColor: (value: `$${keyof SystemColors}`) => ({
      "--color": `$colors${value}`,
      color: value,
    }),
    layer: (value: "1" | "2" | "3" | "4" | "5") => ({
      backgroundColor: `$layer${value}`,
      "--layer": `$colors$layer${value}`,
    }),
  },
});

export * from "@stitches/react";

export type StyleObject = CSS<typeof designSystem>;

export type ScaleValue<T> = StitchesScaleValue<T, typeof designSystem>;
type Theme = typeof theme;

type Prefixed<K extends string, T> = `${K}${Extract<
  T,
  boolean | number | string
>}`;

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

export const defaultTheme = createTheme("light", {
  colors: {
    ...aliasColor("gray", slate, true),
    ...aliasColor("grayA", slateA, true),
    ...aliasColor("primary", indigo),
    ...aliasColor("primaryA", indigoA),
    ...aliasColor("accent", amber, true),
    ...aliasColor("accentA", amberA, true),
    ...aliasColor("danger", red),
    ...aliasColor("dangerA", redA),
    ...aliasColor("success", grass),
    ...aliasColor("successA", grassA),
    ...aliasColor("warning", amber, true),
    ...aliasColor("warningA", amberA, true),
    ...aliasColor("info", blue),
    ...aliasColor("infoA", blueA),
    ...aliasColor("colorScheme", slate, true),
    black: "$colors$gray12",
    white: "#ffffff",
    shadowColor: "$gray12",
    layer1: "$white",
    layer2: "$gray1",
    layer3: "$gray2",
    layer4: "$gray3",
    layer5: "$gray6",
    focusColor: "$colors$primary10",
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
    ...aliasColor("danger", redDark),
    ...aliasColor("dangerA", redDarkA),
    ...aliasColor("success", grassDark),
    ...aliasColor("successA", grassDarkA),
    ...aliasColor("warning", amberDark, true),
    ...aliasColor("warningA", amberDarkA, true),
    ...aliasColor("info", blueDark),
    ...aliasColor("infoA", blueDarkA),
    ...aliasColor("colorScheme", slateDark),
    black: "$colors$gray1",
    white: "$colors$gray12",
    shadowColor: "$gray12",
    layer1: "$black",
    layer2: "$gray1",
    layer3: "$gray2",
    layer4: "$gray3",
    layer5: "$gray6",
  },
});

export { innerFocusStyle, outerFocusStyle };
