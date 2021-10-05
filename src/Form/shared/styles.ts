import { borderFocus } from "../../stitches/utils";
import { StyleObject } from "../../stitches";

export const baseInputStyles: StyleObject = {
  $$borderWidth: "1px",
  border: "$$borderWidth solid $colors$gray8",

  transition: "all 0.2s",

  "&:hover": { borderColor: "$primary9" },

  "&[data-state='checked']": {
    backgroundColor: "$primary9",
    borderColor: "$primary9",
  },

  focusStyle: "inner",

  "&:disabled, &[data-disabled='true']": {
    opacity: 0.4,
    borderColor: "$gray8",
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
