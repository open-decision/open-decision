import { styled } from "../stitches";

export type ButtonProps = React.ComponentProps<typeof Button>;
export const Button = styled("button", {
  $$borderWidth: "2px",
  $$paddingInline: "$space$4",
  //Mini reset
  appearance: "none",
  colorScheme: "primary",

  //The small animation pressing the Button down on click.
  transition: "all",
  transitionDuration: "0.1s",

  "&:active": {
    transform: "translateY(2px)",
    boxShadow: "$inner",
  },

  fontWeight: "$semibold",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "$base",
  border: "$$borderWidth solid transparent",
  paddingInline: "$$paddingInline",

  color: "$colorScheme11",
  boxShadow: "$sm",

  variants: {
    size: {
      sm: {
        $$paddingInline: "$space$2",
        paddingBlock: "$1",
        fontSize: "$sm",
      },
      md: {
        paddingBlock: "$2",
      },
      lg: {
        $$paddingInline: "$space$6",
        fontSize: "$lg",
        paddingBlock: "$3",
      },
      xl: {
        $$paddingInline: "$space$8",
        fontSize: "$xl",
        paddingBlock: "$4",
      },
    },

    variant: {
      primary: {
        backgroundColor: "$colorScheme3",

        "&:hover, &:focus": {
          backgroundColor: "$colorScheme4",
        },
      },
      secondary: {
        backgroundColor: "transparent",
        borderColor: "$colorScheme7",

        "&:hover, &:focus": {
          backgroundColor: "$colorScheme2",
        },
      },
      tertiary: {
        backgroundColor: "unset",
        boxShadow: "unset",
        borderColor: "transparent",

        "&:hover, &:focus": {
          backgroundColor: "$colorScheme4",
        },
      },
      ghost: {
        color: "currentcolor",
        backgroundColor: "unset",
        boxShadow: "unset",

        "&:hover, &:focus": {
          backgroundColor: "unset",
          boxShadow: "unset",
        },
      },
    },

    rounded: {
      none: { borderRadius: "$none" },
      sm: { borderRadius: "$sm" },
      base: { borderRadius: "$base" },
      md: { borderRadius: "$md" },
      lg: { borderRadius: "$lg" },
      full: { borderRadius: "$full" },
    },

    alignContent: {
      true: {
        transform: "translateX(calc(($$borderWidth + $$paddingInline) * -1))",
      },
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "md",
    rounded: "base",
  },
});
