import { styled } from "utils/stitches.config";
export const Button = styled("button", {
  //Mini reset
  appearance: "none",

  //The small animation pressing the Button down on click.
  transition: "all",
  transitionDuration: "0.1s",
  "&:active": {
    transform: "translateY(2px)",
  },

  fontWeight: "$bold",
  padding: "$2 $4",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  variants: {
    variant: {
      primary: {
        backgroundColor: "$primary200",
        color: "$primary900",
        boxShadow: "$sm",

        "&:hover, &:focus": {
          backgroundColor: "$primary300",
          boxShadow: "$md",
        },
      },
      secondary: {
        backgroundColor: "$secondary200",
        color: "$secondary900",
        boxShadow: "$sm",

        "&:hover, &:focus": {
          backgroundColor: "$secondary300",
          boxShadow: "$md",
        },
      },
      icon: {
        padding: "$1",
      },
      ghost: {},
    },

    rounded: {
      default: {
        borderRadius: "$md",
      },
      full: {
        borderRadius: "$full",
      },
      none: {},
    },

    outlined: {
      true: {
        borderWidth: "$2",
        borderColor: "currentcolor",
        boxShadow: "$sm",
      },
    },

    size: {
      small: {
        padding: "$1 $3",
        fontSize: "$sm",
      },
      default: {
        padding: "$2 $4",
      },
      large: {
        fontSize: "$xl",
        padding: "$3 $5",
        md: {
          fontSize: "$2xl",
          padding: "$6 $8",
        },
      },
      xLarge: {
        fontSize: "$xl",
        padding: "$8 $10",
      },
    },
  },

  compoundVariants: [
    {
      variant: "ghost",
      css: {
        boxShadow: "none",
      },
    },
    {
      variant: "primary",
      outlined: "true",
      css: {
        backgroundColor: "transparent",
        color: "$primary700",

        "&:hover, &:focus": {
          backgroundColor: "$primary100",
        },
      },
    },
    {
      variant: "secondary",
      outlined: "true",
      css: {
        backgroundColor: "transparent",
        color: "$secondary700",

        "&:hover, &:focus": {
          backgroundColor: "$secondary100",
        },
      },
    },
  ],

  defaultVariants: {
    variant: "primary",
    rounded: "default",
    size: "default",
  },
});
