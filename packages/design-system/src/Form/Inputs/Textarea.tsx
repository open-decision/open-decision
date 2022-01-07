import * as React from "react";
import { styled } from "../../stitches";
import { baseInputStyles } from "../shared/styles";

const StyledTextarea = styled("textarea", baseInputStyles, {
  backgroundColor: "transparent",

  borderRadius: "$md",
  textStyle: "medium-text",
  minWidth: 0,

  variants: {
    size: {
      medium: {
        padding: "$2 $3",
      },
      large: {
        padding: "$3",
      },
    },
  },

  defaultVariants: {
    size: "medium",
  },
});

export type TextAreaProps = React.ComponentProps<typeof StyledTextarea> & {
  name: string;
};

function TextareaImpl(
  { css, ...props }: TextAreaProps,
  forwardedRef: React.Ref<HTMLTextAreaElement>
) {
  return <StyledTextarea ref={forwardedRef} css={css} {...props} />;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  TextareaImpl
);
