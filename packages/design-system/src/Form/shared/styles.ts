import { StyleObject } from "../../stitches";
import { alignByContent } from "../../stitches/utils";

export const baseInputStyles = {
  $$borderWidth: "1px",
  border: "$$borderWidth solid $colors$gray8",

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
} as const;

export const baseTextInputStyle = {
  $$XTranslation: "0px",
  transform: "translateX($$XTranslation)",

  variants: {
    size: {
      medium: { $$paddingBlock: "$space$2" },
      large: { $$paddingInline: "$space$3" },
    },

    alignByContent,
  },

  defaultVariants: {
    size: "medium",
  },
};

export const baseInputBoxStyles: StyleObject = {
  width: "24px",
  height: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
};
