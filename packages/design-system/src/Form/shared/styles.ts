import { css } from "../../stitches";
import { alignByContent } from "../../shared/variants";

export const baseInputStyles = css({
  $$borderWidth: "1px",
  border: "$$borderWidth solid $colors$gray8",
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
    size: {
      small: {
        $$paddingBlock: "$space$2",
        $$paddingInline: "$space$2",
        textStyle: "small-text",
      },
      medium: {
        $$paddingBlock: "calc($space$3 - 2px)",
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
