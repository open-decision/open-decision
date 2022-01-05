import * as React from "react";
import { useFormContext } from "react-hook-form";
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

type TextAreaProps = React.ComponentProps<typeof StyledTextarea> & {
  name: string;
};

export function Textarea({ name, ...props }: TextAreaProps) {
  const { register } = useFormContext();
  const { ref, ...inputProps } = register(name, props);

  return <StyledTextarea ref={ref} {...inputProps} />;
}
