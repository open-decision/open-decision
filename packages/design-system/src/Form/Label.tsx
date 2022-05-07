import { disabledStyle } from "../shared/utils";
import { styled, css } from "../stitches";

export const labelStyles = css({
  display: "inline-flex",
  colorFallback: "$colorScheme-text",
  alignItems: "center",
  gap: "$2",

  ...disabledStyle({ color: "$gray11" }),

  variants: {
    size: {
      small: {
        textStyle: "small-text",
        fontWeight: 500,
      },
      medium: {
        textStyle: "medium-text",
        fontWeight: 500,
      },
      large: {
        textStyle: "large-text",
        fontWeight: 500,
      },
    },
  },

  defaultVariants: {
    size: "medium",
  },
});

export type LabelProps = React.ComponentProps<typeof Label>;
export const Label = styled("label", labelStyles);
