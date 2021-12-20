import { alignByContent } from "../stitches/utils";
import { styled, css } from "../stitches";
import { iconSizes } from "../Icon/shared";

export const buttonStyles = css(alignByContent, {
  $$borderWidth: "1px",
  $$paddingInline: "$space$6",
  $$paddingBlock: "$space$3",
  $$YTranslation: "0px",

  //Mini reset
  appearance: "none",
  colorScheme: "primary",
  borderRadius: "$md",

  //The small animation pressing the Button down on click.
  transition: "transform background-color",
  transitionDuration: "0.1s",
  transform: "translate($$XTranslation, $$YTranslation)",

  "&:disabled": {
    opacity: 0.4,
    pointerEvents: "none",
  },

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "$2",
  border: "$$borderWidth solid transparent",
  padding: "$$paddingBlock $$paddingInline",
  focusStyle: "outer",

  variants: {
    size: {
      small: {
        $$paddingInline: "$space$4",
        $$paddingBlock: "$space$2",
        textStyle: "small-text",
        fontWeight: 600,
        letterSpacing: "0.025em",
      },
      medium: {
        textStyle: "medium-text",
        fontWeight: 600,
        letterSpacing: "0.025em",
      },
      large: {
        $$paddingInline: "$space$8",
        $$paddingBlock: "$space$4",
        textStyle: "large-text",
        fontWeight: 600,
        letterSpacing: "0.025em",
      },
    },
    variant: {
      primary: {
        boxShadow: "$3",
        backgroundColor: "$colorScheme9",
        color: "$colorScheme-text !important",

        "&:hover, &:focus-visible": {
          backgroundColor: "$colorScheme10",
        },

        "&:active, &[data-active='true']": {
          backgroundColor: "$colorScheme11",
        },

        "&[data-state=on]": {
          backgroundColor: "$colorScheme11",
          boxShadow: "none",
        },

        "&:disabled": {
          opacity: 0.2,
          backgroundColor: "$colorScheme9",
        },
      },

      secondary: {
        backgroundColor: "$colorScheme3",
        color: "$colorScheme11 !important",
        boxShadow: "$1",

        "&:hover, &:focus-visible": {
          backgroundColor: "$colorScheme5",
        },

        "&:active, &[data-active='true']": {
          backgroundColor: "$colorScheme7",
        },

        "&[data-state=on]": {
          backgroundColor: "$colorScheme5",
          boxShadow: "none",
        },

        "&:disabled": {
          backgroundColor: "$colorScheme3",
        },
      },

      tertiary: {
        backgroundColor: "transparent",
        color: "$colorScheme11 !important",
        borderColor: "currentcolor",

        "&:hover, &:focus-visible": {
          backgroundColor: "$colorScheme3",
        },

        "&:active, &[data-active='true']": {
          backgroundColor: "$colorScheme5",
        },

        "&[data-state=on]": {
          backgroundColor: "$colorScheme5",
        },

        "&:disabled": {
          backgroundColor: "$colorScheme1",
        },
      },

      ghost: {
        colorScheme: "gray",
        color: "$gray12 !important",
        backgroundColor: "unset",
        boxShadow: "unset",
        focusStyle: "inner",

        "&:hover, &:focus-visible, &[data-active='true']": {
          color: "$colorScheme11 !important",
        },

        "&[data-state=on]": {
          color: "$primary11 !important",
          backgroundColor: "$colorScheme2 !important",
        },

        "&:disabled": {
          backgroundColor: "unset",
        },
      },
    },

    pressable: {
      true: {
        "&:active": {
          $$YTranslation: "1px",
          boxShadow: "none",
        },
      },
    },

    square: {
      true: {
        padding: "$$paddingInline",
      },
    },

    round: {
      true: {
        borderRadius: "$full",
      },
    },
  },

  compoundVariants: [
    {
      square: true,
      size: "small",
      css: iconSizes.small,
    },
    {
      square: true,
      size: "medium",
      css: iconSizes.medium,
    },
    {
      square: true,
      size: "large",
      css: iconSizes.large,
    },
  ],

  defaultVariants: {
    variant: "primary",
    size: "medium",
    pressable: true,
  },
});

export type ButtonProps = React.ComponentProps<typeof Button>;
export const Button = styled("button", buttonStyles);
