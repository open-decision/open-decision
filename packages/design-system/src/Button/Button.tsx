import { activeStyle, disabledStyle, intentStyle } from "../shared/utils";
import { alignByContent } from "../shared/variants";
import { styled, css, darkTheme } from "../stitches";

export const buttonStyles = css(alignByContent, {
  $$borderWidth: "1px",
  $$YTranslation: "0px",
  $$gap: "$space$2",
  gap: "$$gap",
  cursor: "pointer",

  //Mini reset
  appearance: "none",
  colorScheme: "primary",
  borderRadius: "$md",

  //The small animation pressing the Button down on click.
  transition: "transform background-color",
  transitionDuration: "0.1s",
  transform: "translate($$XTranslation, $$YTranslation)",

  ...disabledStyle({
    cursor: "not-allowed",
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
        fontWeight: 500,
      },
      medium: {
        $$paddingInline: "$space$3",
        $$paddingBlock: "$space$2",
        textStyle: "medium-text",
        fontWeight: 500,
      },
      large: {
        $$paddingInline: "$space$4",
        $$paddingBlock: "$space$3",
        textStyle: "large-text",
        fontWeight: 500,
        $$gap: "$space$2",
      },
      xl: {
        $$paddingInline: "$space$5",
        $$paddingBlock: "$space$3",
        textStyle: "large-text",
        fontWeight: 500,
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

        [`.${darkTheme} &`]: {
          backgroundColor: "$colorScheme4",
        },

        ...intentStyle({
          backgroundColor: "$colorScheme5",

          [`.${darkTheme} &`]: {
            backgroundColor: "$colorScheme6",
            color: "$colorScheme12",
          },
        }),

        ...activeStyle({
          backgroundColor: "$colorScheme7",
        }),

        ...disabledStyle({
          backgroundColor: "$colorScheme3",

          [`.${darkTheme} &`]: {
            backgroundColor: "$colorScheme4",
          },
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
