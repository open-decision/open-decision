import { styled } from "../stitches";
export * from "./InputWithButton";

export const Input = styled("input", {
  colorScheme: "primary",
  padding: "$2 $3",
  backgroundColor: "$gray2",
  boxShadow: "$inner",
  color: "$gray12",
  border: "2px solid $colors$gray5",
  outline: "none",

  "&:focus": {
    backgroundColor: "$gray3",
    borderColor: "$colorScheme3",
    boxShadow: "inset 0 0 0 2px $colors$colorScheme9",
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
