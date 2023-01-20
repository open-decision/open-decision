import { FileInput, FileInputProps } from "@open-decision/design-system";
import * as React from "react";

type Props = {
  onFileLoad: (event: ProgressEvent<FileReader>) => void;
} & FileInputProps;

export const FileReaderInput = React.forwardRef<HTMLLabelElement, Props>(
  function FileReaderInput({ onFileLoad, children, ...props }, ref) {
    return (
      <FileInput
        ref={ref}
        onChange={(event) => {
          const fileReader = new FileReader();
          fileReader.onload = function (event) {
            onFileLoad(event);
          };

          if (!event.currentTarget.files?.[0]) return;
          fileReader.readAsText(event.currentTarget.files[0]);
          event.target.value = "";
        }}
        {...props}
      >
        {children}
      </FileInput>
    );
  }
);
