import { styled, css } from "../stitches";
import { disabledSelector } from "../stitches/stateSelectors";

export const labelStyles = css({
  display: "inline-flex",
  colorFallback: "$colorScheme-text",
  alignItems: "center",
  gap: "$2",
  fontWeight: "500",

  [`${disabledSelector}`]: { color: "$gray11" },

  variants: {
    size: {
      small: {
        textStyle: "small-text",
      },
      medium: {
        textStyle: "medium-text",
      },
      large: {
        textStyle: "large-text",
      },
    },
  },

  defaultVariants: {
    size: "medium",
  },
});

export type LabelProps = React.ComponentProps<typeof Label>;
export const Label = styled("label", labelStyles);
