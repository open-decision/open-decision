import { alignByContent } from "../stitches/utils";
import { styled } from "../stitches";

export type ButtonProps = React.ComponentProps<typeof Button>;
export const Button = styled("button", {
  $$borderWidth: "1px",
  $$paddingInline: "$space$6",
  $$paddingBlock: "$space$3",
  $$YTranslation: "0px",
  $$XTranslation: "0px",

  //Mini reset
  appearance: "none",
  colorScheme: "primary",
  borderRadius: "$md",
  maxWidth: "max-content",

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

        "&:disabled": {
          opacity: 0.2,
          backgroundColor: "$colorScheme9",
        },
      },
      secondary: {
        backgroundColor: "$colorScheme3",
        color: "$colorScheme11 !important",

        "&:hover, &:focus-visible": {
          backgroundColor: "$colorScheme5",
        },

        "&:active, &[data-active='true']": {
          backgroundColor: "$colorScheme7",
        },

        "&:disabled": {
          backgroundColor: "$colorScheme3",
        },
      },
      tertiary: {
        backgroundColor: "$colorScheme1",
        color: "$colorScheme11 !important",
        borderColor: "currentcolor",

        "&:hover, &:focus-visible": {
          backgroundColor: "$colorScheme3",
        },

        "&:active, &[data-active='true']": {
          backgroundColor: "$colorScheme5",
        },

        "&:disabled": {
          backgroundColor: "$colorScheme1",
        },
      },
      ghost: {
        colorScheme: "gray",
        color: "$gray11 !important",
        backgroundColor: "unset",
        boxShadow: "unset",
        focusStyle: "inner",

        "&:hover, &:focus-visible, &[data-active='true']": {
          color: "$colorScheme11 !important",
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

    alignByContent,
  },

  defaultVariants: {
    variant: "primary",
    size: "medium",
    pressable: true,
  },
});
