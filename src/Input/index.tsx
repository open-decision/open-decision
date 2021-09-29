import { styled } from "../stitches";
export * from "./InputWithButton";

export const Input = styled("input", {
  colorScheme: "primary",
  padding: "$1",
  color: "$gray11",
  border: "1px solid $colors$gray5",
  outline: "none",
  borderRadius: "$md",

  "&:focus-visible": {
    borderColor: "$colorScheme3",
    boxShadow: "inset 0 0 0 1px $colors$colorScheme9",
  },

  "&:disabled": {
    opacity: 0.3,
  },

  "&[data-state='valid']": {
    borderColor: "$success10",
  },

  "&[data-state='invalid']": {
    borderColor: "$error10",
  },
});

export const Label = styled("label", {
  color: "var(--color, $gray12)",
  fontSize: "$base",
  fontWeight: "$medium",
  display: "block",

  "@tablet": {
    fontSize: "$lg",
  },
});
