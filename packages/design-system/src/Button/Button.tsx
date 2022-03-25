import { activeStyle, disabledStyle, intentStyle } from "../shared/utils";
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

  ...disabledStyle({
    opacity: 0.4,
    pointerEvents: "none",
  }),

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "$$borderWidth solid transparent",
  padding: "$$paddingBlock $$paddingInline",
  focusType: "outer",

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

        ...intentStyle({
          backgroundColor: "$colorScheme10",
        }),

        ...activeStyle({
          backgroundColor: "$colorScheme11",
        }),

        ...disabledStyle({
          backgroundColor: "$colorScheme9",
        }),
      },

      secondary: {
        backgroundColor: "$colorScheme3",
        color: "$colorScheme11",

        ...intentStyle({
          backgroundColor: "$colorScheme5",
        }),

        ...activeStyle({
          backgroundColor: "$colorScheme7",
        }),

        ...disabledStyle({
          backgroundColor: "$colorScheme3",
        }),
      },

      tertiary: {
        backgroundColor: "transparent",
        color: "$colorScheme11",
        borderColor: "currentcolor",

        ...intentStyle({
          backgroundColor: "$colorScheme3",
        }),

        ...activeStyle({
          backgroundColor: "$colorScheme5",
        }),

        ...disabledStyle({
          backgroundColor: "$colorScheme1",
        }),
      },

      ghost: {
        backgroundColor: "unset",
        focusType: "inner",
        colorFallback: "$colorScheme-text",
      },

      neutral: {
        colorScheme: "gray",
        color: "$colorScheme11",
        backgroundColor: "unset",
        focusType: "inner",

        ...intentStyle({
          backgroundColor: "$colorScheme3",
          color: "$colorScheme12",
        }),

        ...activeStyle({
          color: "$colorScheme12",
          backgroundColor: "$colorScheme5",
        }),

        ...disabledStyle({
          backgroundColor: "unset",
        }),
      },
    },

    pressable: {
      true: {
        ...activeStyle({
          $$YTranslation: "1px",
        }),
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
