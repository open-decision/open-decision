import {
  createStitches,
  CSS,
  ScaleValue as StitchesScaleValue,
} from "@stitches/react";
import { tokens, media } from "../internal/tokens";
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
} from "@radix-ui/colors";
import { ColorKeys, aliasColor, TextStyles } from "../internal/utils";
import { Prefixed } from "@stitches/react/types/util";

const { colors, ...otherTokens } = tokens;

export const designSystem = createStitches({
  theme: {
    colors: {
      ...colors,
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
      "colorScheme-text": "$colors$black",
    },
    ...otherTokens,
    fonts: {
      sans: "poppins, -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, roboto, noto, arial, sans-serif;",
      serif:
        "Iowan Old Style, Apple Garamond, Baskerville, Times New Roman, Droid Serif, Times, Source Serif Pro, serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
      heading: "$sans",
      text: "$sans",
    },
  },
  media,
  utils: {
    colorScheme: (value: ColorKeys) => {
      return {
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
        "--colors-colorScheme-text": `$colors$${value}-text`,
      };
    },
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
        color: "inherit",
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
