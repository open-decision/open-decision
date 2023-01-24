import * as React from "react";
import { FileInput, FileInputProps } from "./FileInput";

type Props = {
  onFileLoad: (event: ProgressEvent<FileReader>, fileName?: string) => void;
} & FileInputProps;

export const FileReaderInput = React.forwardRef<HTMLLabelElement, Props>(
  function FileReaderInput({ onFileLoad, children, ...props }, ref) {
    return (
      <FileInput
        ref={ref}
        onChange={(event) => {
          const fileReader = new FileReader();

          const fileName = event.currentTarget.files?.[0].name;

          fileReader.onload = function (event) {
            onFileLoad(event, fileName);
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
