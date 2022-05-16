import {
  Icon,
  Label,
  LabelProps,
  styled,
  StyleObject,
} from "@open-decision/design-system";
import { DownloadIcon } from "@radix-ui/react-icons";
import React, { ForwardedRef } from "react";

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
} & LabelProps;

/**
 * A custom Form element wrapping the native file input type.
 */
const FileInputImpl = (
  { children, css, onChange, ...props }: FileInputProps,
  ref: ForwardedRef<HTMLLabelElement>
) => {
  return (
    <Label css={css} ref={ref} {...props}>
      <Icon css={{ marginTop: "2px" }}>
        <DownloadIcon />
      </Icon>
      {children}
      <HiddenInput type="file" onChange={onChange} />
    </Label>
  );
};

export const FileInput = React.forwardRef(FileInputImpl);
