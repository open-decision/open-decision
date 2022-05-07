import * as React from "react";
import { styled } from "../stitches";
import { baseInputStyles, baseTextInputStyle } from "./shared/styles";

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
