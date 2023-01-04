import { Icon as SystemIcon } from "../../Icon";

import { DownloadIcon, UploadIcon } from "@radix-ui/react-icons";
import React, { ForwardedRef } from "react";
import { Label, LabelProps } from "../../Label";
import { VisuallyHidden } from "ariakit";

const Icons = {
  upload: (
    <SystemIcon>
      <UploadIcon />
    </SystemIcon>
  ),
  download: (
    <SystemIcon className="mt-[2px]">
      <DownloadIcon />
    </SystemIcon>
  ),
};

export type FileInputProps = {
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  children: React.ReactNode;
  disabled?: boolean;
  Icon?: React.ReactNode;
  accept?: React.InputHTMLAttributes<HTMLInputElement>["accept"];
  type?: "upload" | "download";
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
    type = "download",
    ...props
  }: FileInputProps,
  ref: ForwardedRef<HTMLLabelElement>
) => {
  return (
    <Label className={className} ref={ref} data-disabled={disabled} {...props}>
      {Icon ? Icon : Icons[type]}
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
