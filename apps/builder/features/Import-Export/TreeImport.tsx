import { FileInputProps, FileReaderInput } from "@open-decision/design-system";
import * as React from "react";
import { useImport } from "./useImport";

export const TreeImport = React.forwardRef<
  HTMLLabelElement,
  FileInputProps & { onDone?: () => void }
>(function TreeImport({ onDone, children, ...props }, ref) {
  const { mutate: createTree } = useImport({
    onSettled: () => onDone?.(),
  });

  return (
    <FileReaderInput
      ref={ref}
      onFileLoad={(event) => createTree({ event })}
      {...props}
    >
      {children}
    </FileReaderInput>
  );
});
