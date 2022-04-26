import { css } from "../../stitches";
import { alignByContent } from "../../shared/variants";

export const baseInputStyles = css({
  $$borderWidth: "1px",
  border: "$$borderWidth solid $colors$gray7",
  textStyle: "medium-text",

  transition: "all 0.2s",

  "&[data-state='checked']": {
    backgroundColor: "$primary9",
    borderColor: "$primary9",
  },

  "&:disabled, &[data-disabled='true']": {
    opacity: 0.4,
    borderColor: "$gray8",
  },
});

export const baseTextInputStyle = css(alignByContent, {
  variants: {
    variant: {
      raised: {},
      lowered: {
        layer: "4",
        borderColor: "transparent",
      },
    },
    size: {
      small: {
        $$paddingBlock: "$space$2",
        $$paddingInline: "$space$2",
        textStyle: "small-text",
      },
      medium: {
        $$paddingBlock: "$space$2",
        $$paddingInline: "$space$3",
        textStyle: "medium-text",
      },
      large: {
        $$paddingInline: "$space$3",
        $$paddingBlock: "$space$4",
        textStyle: "large-text",
      },
    },
  },

  defaultVariants: {
    size: "medium",
    variant: "raised",
  },
});

export const baseInputBoxStyles = css({
  width: "24px",
  height: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
});
