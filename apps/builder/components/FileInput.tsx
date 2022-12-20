import {
  Icon,
  Label,
  LabelProps,
  VisuallyHidden,
} from "@open-decision/design-system";
import { DownloadIcon } from "@radix-ui/react-icons";
import React, { ForwardedRef } from "react";

export type FileInputProps = {
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  children: React.ReactNode;
} & Omit<LabelProps, "onChange">;

/**
 * A custom Form element wrapping the native file input type.
 */
const FileInputImpl = (
  { children, className, onChange, ...props }: FileInputProps,
  ref: ForwardedRef<HTMLLabelElement>
) => {
  return (
    <Label className={className} ref={ref} {...props}>
      <Icon className="mt-[2px]">
        <DownloadIcon />
      </Icon>
      {children}
      <VisuallyHidden>
        <input type="file" onChange={onChange} />
      </VisuallyHidden>
    </Label>
  );
};

export const FileInput = React.forwardRef(FileInputImpl);
