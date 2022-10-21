import { styled, css } from "@open-decision/design-system/src/stitches";
import { disabledSelector } from "@open-decision/design-system/src/stitches/stateSelectors";
import { textStyles } from "@open-decision/design-system/src/Text";

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
