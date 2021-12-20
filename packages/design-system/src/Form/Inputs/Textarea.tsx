import * as React from "react";
import { styled } from "../../stitches";
import { baseInputStyles } from "../shared/styles";
import { useInput } from "../useForm";

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
  const { value, setValue } = useInput(name, "string");

  return (
    <StyledTextarea
      name="test"
      value={value}
      onChange={(event) => setValue(event.target.value ?? "")}
      {...props}
    />
  );
}
