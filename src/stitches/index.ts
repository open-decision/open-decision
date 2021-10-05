import { createStitches, CSS } from "@stitches/react";
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
  yellowDark,
  yellowDarkA,
} from "@radix-ui/colors";
import { ColorKeys, aliasColor, TextStyles } from "../internal/utils";

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
    },
    ...otherTokens,
    fonts: {
      sans:
        "poppins, -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, roboto, noto, arial, sans-serif;",
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
    textStyle: (value: TextStyles) => {
      const sharedTextStyles = {
        fontSize: `$${value}`,
        lineHeight: `$${value}`,
        letterSpacing: `$${value}`,
        fontWeight: `$${value}`,
      };

      switch (value) {
        case "large-heading":
        case "medium-heading":
        case "small-heading":
        case "extra-small-heading":
          return {
            fontFamily: "$heading",
            ...sharedTextStyles,
          };

        default:
          return { fontFamily: "$text", ...sharedTextStyles };
      }
    },
    focusStyle: (value: "inner" | "outer") => {
      switch (value) {
        case "outer":
          return {
            "&:focus-visible, &:focus-within": {
              outlineOffset: "$space$1",
              outlineColor: "$primary9",
            },
          };

        default:
          return {
            "&:focus-visible, &:focus-within": {
              boxShadow: "inset 0 0 0 1px $colors$primary9",
              borderColor: "$primary9",
              outline: "none",
            },
          };
      }
    },
  },
});

export type StyleObject = CSS<typeof designSystem>;

export * from "@stitches/react";

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

export const darkTheme = createTheme("dark", {
  colors: {
    ...aliasColor("gray", slateDark),
    ...aliasColor("grayA", slateDarkA),
    ...aliasColor("primary", indigoDark),
    ...aliasColor("primaryA", indigoDarkA),
    ...aliasColor("accent", amberDark),
    ...aliasColor("accentA", amberDarkA),
    ...aliasColor("error", redDark),
    ...aliasColor("errorA", redDarkA),
    ...aliasColor("success", greenDark),
    ...aliasColor("successA", greenDarkA),
    ...aliasColor("warning", yellowDark),
    ...aliasColor("warningA", yellowDarkA),
    ...aliasColor("info", blueDark),
    ...aliasColor("infoA", blueDarkA),
    ...aliasColor("colorScheme", slateDark),
  },
});
