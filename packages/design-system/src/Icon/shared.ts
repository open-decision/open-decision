import { css } from "../stitches";

export const iconSizes = css({
  variants: {
    size: {
      "extra-small": {
        $$paddingInline: "$space$1",

        "&  svg": {
          width: "var(--iconSize, 16px)",
          height: "var(--iconSize, 16px)",
        },
      },
      small: {
        $$paddingInline: "$space$2",

        "&  svg": {
          width: "var(--iconSize, 18px)",
          height: "var(--iconSize, 18px)",
        },
      },
      medium: {
        $$paddingInline: "$space$2",

        "&  svg": {
          width: "var(--iconSize, 22px)",
          height: "var(--iconSize, 22px)",
        },
      },
      large: {
        $$paddingInline: "$space$3",

        "&  svg": {
          width: "var(--iconSize, 24px)",
          height: "var(--iconSize, 24px)",
        },
      },
    },
  },
});
