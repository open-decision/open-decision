import { css } from "@open-decision/design-system/src/stitches";

export const baseInputStyles = css({
  colorScheme: "primary",
  $$borderWidth: "1px",
  border: "$$borderWidth solid $colors$gray7",
  textStyle: "medium-text",

  transition: "all 0.2s",

  "&:disabled, &[data-disabled='true']": {
    opacity: 0.4,
    borderColor: "$gray8",
  },

  variants: {
    variant: {
      raised: { layer: "2" },
      lowered: {
        layer: "4",
        borderColor: "transparent",
      },
    },
  },

  defaultVariants: {
    variant: "raised",
  },
});

export const baseTextInputStyle = css({
  borderRadius: "$md",
  focusType: "inner-within",
  display: "flex",
  alignItems: "center",

  variants: {
    size: {
      small: {
        $$paddingBlock: "$space$1",
        $$paddingInline: "$space$2",
        textStyle: "small-text",
      },
      medium: {
        $$paddingBlock: "$space$2",
        $$paddingInline: "$space$3",
        textStyle: "medium-text",
      },
      large: {
        $$paddingInline: "$space$4",
        $$paddingBlock: "$space$3",
        textStyle: "large-text",
      },
      xl: {
        $$paddingInline: "$space$5",
        $$paddingBlock: "$space$3",
        textStyle: "large-text",
      },
    },
  },

  defaultVariants: {
    size: "medium",
  },
});

export const baseInputBoxStyles = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  focusType: "outer-within",

  "&[data-checked='true']": {
    backgroundColor: "$colorScheme9",
    borderColor: "$colorScheme9",
  },
});
