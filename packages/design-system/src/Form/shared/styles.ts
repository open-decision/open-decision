import { css } from "../../stitches";
import { alignByContent } from "../../stitches/utils";

export const baseInputStyles = css({
  $$borderWidth: "1px",
  border: "$$borderWidth solid $colors$gray8",
  color: "var(--color, $colorScheme-text)",
  textStyle: "medium-text",

  transition: "all 0.2s",

  "&:hover": {
    borderColor: "$primary9",

    ".icon > svg": {
      stroke: "$primary9",
    },
  },

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
