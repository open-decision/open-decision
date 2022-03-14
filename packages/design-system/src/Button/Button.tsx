import { alignByContent } from "../shared/variants";
import { styled, css } from "../stitches";

export const buttonStyles = css(alignByContent, {
  $$borderWidth: "1px",
  $$YTranslation: "0px",
  $$gap: "$space$2",
  gap: "$$gap",

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
  border: "$$borderWidth solid transparent",
  padding: "$$paddingBlock $$paddingInline",
  focusStyle: "outer",

  variants: {
    size: {
      small: {
        $$paddingInline: "$space$2",
        $$paddingBlock: "$space$1",
        textStyle: "small-text",
        fontWeight: 600,
      },
      medium: {
        $$paddingInline: "$space$4",
        $$paddingBlock: "calc($space$3 - 2px)",
        textStyle: "medium-text",
        fontWeight: 600,
      },
      large: {
        $$paddingInline: "$space$5",
        $$paddingBlock: "$space$3",
        textStyle: "large-text",
        fontWeight: 600,
        $$gap: "$space$2",
      },
    },
    variant: {
      primary: {
        backgroundColor: "$colorScheme9",
        color: "$white",

        "&:hover, &:focus-visible": {
          backgroundColor: "$colorScheme10",
        },

        "&:active, &[data-active='true'], &[data-state=on]": {
          backgroundColor: "$colorScheme11",
        },

        "&:disabled": {
          backgroundColor: "$colorScheme9",
        },
      },

      secondary: {
        backgroundColor: "$colorScheme3",
        color: "$colorScheme11",

        "&:hover, &:focus-visible": {
          backgroundColor: "$colorScheme5",
        },

        "&:active, &[data-active='true'], &[data-state=on]": {
          backgroundColor: "$colorScheme7",
        },

        "&:disabled": {
          backgroundColor: "$colorScheme3",
        },
      },

      tertiary: {
        backgroundColor: "transparent",
        color: "$colorScheme11",
        borderColor: "currentcolor",

        "&:hover, &:focus-visible": {
          backgroundColor: "$colorScheme3",
        },

        "&:active, &[data-active='true'], &[data-state=on]": {
          backgroundColor: "$colorScheme5",
        },

        "&:disabled": {
          backgroundColor: "$colorScheme1",
        },
      },

      ghost: {
        backgroundColor: "unset",
        focusStyle: "inner",
        colorFallback: "$black",
      },

      neutral: {
        colorScheme: "gray",
        color: "$colorScheme11",
        backgroundColor: "unset",
        focusStyle: "inner",

        "&:hover": {
          backgroundColor: "$colorScheme3",
          color: "$colorScheme12",
        },

        "&:active, &[data-active='true'], &[data-state=on]": {
          color: "$colorScheme12",
          backgroundColor: "$colorScheme5",
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
        },
      },
    },

    round: {
      true: {
        borderRadius: "$full",
      },
    },

    square: {
      true: {
        $$paddingInline: "$$paddingBlock",
        aspectRatio: "1 / 1",
      },
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "medium",
    pressable: true,
  },
});

export const Button = styled("button", buttonStyles);
export type ButtonProps = React.ComponentProps<typeof Button>;
