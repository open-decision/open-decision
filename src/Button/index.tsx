import { styled } from "../stitches";

export type ButtonProps = React.ComponentProps<typeof Button>;
export const Button = styled("button", {
  $$borderWidth: "1px",
  $$paddingInline: "$space$3",
  //Mini reset
  appearance: "none",
  colorScheme: "primary",
  fontFamily: "$text",
  borderRadius: "$md",

  //The small animation pressing the Button down on click.
  transition: "transform background-color",
  transitionDuration: "0.1s",

  "&:active": {
    transform: "translateY(2px)",
    boxShadow: "$inner",
  },

  "&:disabled": {
    opacity: 0.4,
  },

  fontWeight: "$semibold",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "$base",
  border: "$$borderWidth solid transparent",
  paddingInline: "$$paddingInline",

  variants: {
    size: {
      sm: {
        $$paddingInline: "$space$2",
        paddingBlock: "$1",
        fontSize: "$sm",
      },
      md: {
        paddingBlock: "$1",
      },
      lg: {
        $$paddingInline: "$space$6",
        fontSize: "$lg",
        paddingBlock: "$2",
      },
      xl: {
        $$paddingInline: "$space$8",
        fontSize: "$xl",
        paddingBlock: "$3",
      },
    },

    variant: {
      primary: {
        boxShadow: "$sm",
        backgroundColor: "$colorScheme9",
        color: "$colorScheme1",

        "&:hover, &:focus-visible": {
          backgroundColor: "$colorScheme10",
        },

        "&:active": {
          backgroundColor: "$colorScheme11",
        },

        "&:disabled": {
          opacity: 0.2,
        },
      },
      secondary: {
        backgroundColor: "$colorScheme3",
        color: "$colorScheme11",

        "&:hover, &:focus-visible": {
          backgroundColor: "$colorScheme5",
        },

        "&:active": {
          backgroundColor: "$colorScheme7",
        },
      },
      tertiary: {
        backgroundColor: "$colorScheme1",
        color: "$colorScheme11",
        borderColor: "currentcolor",

        "&:hover, &:focus-visible": {
          backgroundColor: "$colorScheme3",
        },

        "&:active": {
          backgroundColor: "$colorScheme5",
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

    alignContent: {
      true: {
        transform: "translateX(calc(($$borderWidth + $$paddingInline) * -1))",
      },
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
