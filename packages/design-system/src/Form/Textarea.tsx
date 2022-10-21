import * as React from "react";
import { styled } from "@open-decision/design-system/src/stitches";
import { baseInputStyles, baseTextInputStyle } from "@open-decision/design-system/src/Form/shared/styles";

const StyledTextarea = styled("textarea", baseInputStyles, baseTextInputStyle, {
  paddingBlock: "$$paddingBlock",
  paddingInline: "$$paddingInline",
});

export type TextAreaProps = React.ComponentProps<typeof StyledTextarea>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function Textarea(props, ref) {
    return <StyledTextarea ref={ref} {...props} />;
  }
);
