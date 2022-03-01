import { Stack, styled } from "@open-decision/design-system";

export const NodeLabel = styled("span", Stack, {
  borderRadius: "$md",
  backgroundColor: "$success2",
  flexDirection: "row",
  textStyle: "small-text",
  alignItems: "center",
  gap: "$1",
  padding: "$1",
  border: "1px solid $success7",
  position: "absolute",
  top: "-14px",
  left: "-14px",
  color: "$colorScheme12",
});
