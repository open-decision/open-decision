import * as React from "react";
import { styled } from "../stitches";
import { Input } from "./Input/Input";
import { useInput } from "./useForm";

const StyledTextarea = styled(Input, {
  "&:hover": {
    boxShadow: "none",
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
