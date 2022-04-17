import { styled, css } from "../stitches";

export const labelStyles = css({
  display: "flex",
  colorFallback: "$colorScheme-text",
  alignItems: "center",
  gap: "$3",
  fontWeight: 600,

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
