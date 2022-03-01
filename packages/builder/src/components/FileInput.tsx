import {
  buttonStyles,
  Label,
  styled,
  StyleObject,
} from "@open-decision/design-system";
import React, { ForwardedRef } from "react";

const StyledLabel = styled(Label, buttonStyles, {
  focusStyle: "outer-within",
});

const HiddenInput = styled("input", {
  border: "0",
  clip: "rect(0, 0, 0, 0)",
  height: "1px",
  overflow: "hidden",
  padding: "0",
  position: "absolute !important",
  whiteSpace: "nowrap",
  width: "1px",
});

export type FileInputProps = {
  css?: StyleObject;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  children: React.ReactNode;
  className?: string;
} & React.ComponentProps<typeof StyledLabel>;

/**
 * A custom Form element wrapping the native file input type.
 */
const FileInputImpl = (
  { children, css, onChange, ...props }: FileInputProps,
  ref: ForwardedRef<HTMLLabelElement>
) => {
  return (
    <StyledLabel variant="tertiary" css={css} ref={ref} {...props}>
      {children}
      <HiddenInput type="file" onChange={onChange} />
    </StyledLabel>
  );
};

export const FileInput = React.forwardRef(FileInputImpl);
