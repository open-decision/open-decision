import {
  iconButtonStyles,
  Label,
  styled,
  StyleObject,
} from "@open-legal-tech/design-system";
import React, { ForwardedRef } from "react";

const StyledLabel = styled(Label, iconButtonStyles, {
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
};

/**
 * A custom Form element wrapping the native file input type.
 */
const FileInputImpl = (
  { className, children, css, onChange, ...props }: FileInputProps,
  ref: ForwardedRef<HTMLLabelElement>
) => {
  return (
    <StyledLabel
      square
      variant="secondary"
      css={css}
      className={className}
      ref={ref}
      {...props}
    >
      {children}
      <HiddenInput type="file" onChange={onChange} />
    </StyledLabel>
  );
};

export const FileInput = React.forwardRef(FileInputImpl);
