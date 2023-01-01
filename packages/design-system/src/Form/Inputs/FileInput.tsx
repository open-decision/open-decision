import {
  Icon as SystemIcon,
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
  disabled?: boolean;
  Icon?: React.ReactNode;
  accept?: React.InputHTMLAttributes<HTMLInputElement>["accept"];
} & Omit<LabelProps, "onChange">;

/**
 * A custom Form element wrapping the native file input type.
 */
const FileInputImpl = (
  {
    children,
    className,
    onChange,
    disabled,
    Icon,
    accept,
    ...props
  }: FileInputProps,
  ref: ForwardedRef<HTMLLabelElement>
) => {
  return (
    <Label className={className} ref={ref} data-disabled={disabled} {...props}>
      {Icon ? (
        Icon
      ) : (
        <SystemIcon className="mt-[2px]">
          <DownloadIcon />
        </SystemIcon>
      )}
      {children}
      <VisuallyHidden>
        <input
          type="file"
          onChange={onChange}
          disabled={disabled}
          accept={accept}
        />
      </VisuallyHidden>
    </Label>
  );
};

export const FileInput = React.forwardRef(FileInputImpl);
