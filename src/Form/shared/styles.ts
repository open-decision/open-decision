import { StyleObject } from "../../stitches";

export const baseInputStyles: StyleObject = {
  border: "1px solid $colors$gray8",

  transition: "all 0.2s",

  "&:hover": { borderColor: "$primary9" },

  "&[data-state='checked']": {
    backgroundColor: "$primary9",
    borderColor: "$primary9",
  },

  "&:focus-visible": {
    boxShadow: "inset 0 0 0 1px $colors$primary9",
    borderColor: "$primary9",
    outline: "none",
  },

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
