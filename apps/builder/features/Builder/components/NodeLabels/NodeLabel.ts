import { styled, Row } from "@open-decision/design-system";

export const NodeLabel = styled("span", Row, {
  borderRadius: "$md",
  backgroundColor: "$success2",
  flexDirection: "row",
  textStyle: "small-text",
  alignItems: "center",
  gap: "$1",
  padding: "$1",
  border: "1px solid $success7",
  color: "$colorScheme12",
});
