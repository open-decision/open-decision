import { css, createScaleVariant } from "../stitches";

export const center = css({
  variants: {
    center: {
      true: {
        justifyContent: "center",
        alignItems: "center",
      },
    },
  },
});

export const gap = css({
  $$gap: "$1",
  gap: "$$gap",
  variants: {
    gap: createScaleVariant("space", (token) => ({ $$gap: `$space${token}` })),
  },
});

export const padding = css({
  $$padding: "$space$1",
  padding: "$$padding",
  variants: {
    padding: createScaleVariant("space", (token) => ({
      $$padding: `$space${token}`,
    })),
  },
});

/**
 * Add a Variant to align the element by its content box instead of at the border.
 * `$$paddingInline` and `$$borderWidth` need to be defined as variables and set to the value
 * of their respective properties.
 * @returns the custom property `$$XTranslation`. Use it to apply the transform.
 */
export const alignByContent = css({
  $$XTranslation: 0,
  $$borderWidth: 0,
  $$$paddingInline: 0,
  transform: "translateX($$XTranslation)",

  variants: {
    alignByContent: {
      left: {
        $$XTranslation: "calc(($$borderWidth + $$$paddingInline) * -1)",
      },
      right: {
        $$XTranslation: "calc($$borderWidth + $$$paddingInline)",
      },
      center: {
        $$XTranslation: "0px",
      },
    },
  },
});
