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
      small: { $$paddingBlock: "$space$1", textStyle: "extra-small-text" },
      medium: { $$paddingBlock: "$space$2" },
      large: { $$paddingInline: "$space$3" },
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
