import { styled, css } from "../stitches";
import { disabledSelector } from "../stitches/stateSelectors";
import { textStyles } from "../Text";

export const labelStyles = css({
  display: "inline-flex",
  colorFallback: "$colorScheme-text",
  alignItems: "center",
  gap: "$2",
  fontWeight: "500",
  lineHeight: "0.5",

  [`${disabledSelector}`]: { color: "$gray11" },
});

export type LabelProps = React.ComponentProps<typeof Label>;
export const Label = styled("label", labelStyles, textStyles);
