import { alignByContent } from "../stitches/utils";
import { styled, css } from "../stitches";

export const buttonStyles = css(alignByContent, {
  $$borderWidth: "1px",
  $$paddingInline: "$space$6",
  $$paddingBlock: "$space$3",
  $$YTranslation: "0px",
  $$gap: "$space$1",
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
      "extra-small": {
        $$paddingInline: "$space$1",
        $$paddingBlock: "$space$2",
        "--iconSize": "16px",

        "&  svg": {
          width: "var(--iconSize)",
          height: "var(--iconSize)",
        },
      },
      small: {
        $$paddingInline: "$space$4",
        $$paddingBlock: "$space$2",
        textStyle: "small-text",
        fontWeight: 600,
        letterSpacing: "0.025em",
        "--iconSize": "18px",

        "&  svg": {
          width: "var(--iconSize)",
          height: "var(--iconSize)",
        },
      },
      medium: {
        textStyle: "medium-text",
        fontWeight: 600,
        letterSpacing: "0.025em",
        "--iconSize": "22px",

        "&  svg": {
          width: "var(--iconSize)",
          height: "var(--iconSize)",
        },
      },
      large: {
        $$paddingInline: "$space$8",
        $$paddingBlock: "$space$4",
        textStyle: "large-text",
        fontWeight: 600,
        letterSpacing: "0.025em",
        "--iconSize": "24px",
        $$gap: "$space$2",

        "&  svg": {
          width: "var(--iconSize)",
          height: "var(--iconSize)",
        },
      },
    },
    variant: {
      primary: {
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
        },

        "&:disabled": {
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

        "&[data-state=on]": {
          backgroundColor: "$colorScheme5",
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
        color: "$gray11",
        backgroundColor: "unset",
        focusStyle: "inner",

        "&:hover, &:focus-visible, &[data-active='true']": {
          color: "$colorScheme12",
        },

        "&[data-state=on]": {
          color: "$primary11",
          backgroundColor: "$colorScheme2",
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
        padding: "$$paddingInline",
      },
    },
  },

  compoundVariants: [
    {
      size: "extra-small",
      square: true,
      css: { $$paddingInline: "$space$1" },
    },
    {
      size: "small",
      square: true,
      css: { $$paddingInline: "$space$2" },
    },
    {
      size: "medium",
      square: true,
      css: { $$paddingInline: "$space$3" },
    },
    {
      size: "large",
      square: true,
      css: { $$paddingInline: "$space$4" },
    },
  ],

  defaultVariants: {
    variant: "primary",
    size: "medium",
    pressable: true,
  },
});

export const Button = styled("button", buttonStyles);
export type ButtonProps = React.ComponentProps<typeof Button>;
