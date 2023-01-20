import { FileInputProps } from "@open-decision/design-system";
import * as React from "react";
import { FileReaderInput } from "./FileReaderInput";
import { useOverwriteImport } from "./useImport";

type Props = FileInputProps & { treeUuid: string };

export const OverwriteTreeImport = React.forwardRef<
  HTMLLabelElement,
  Props & { onDone?: () => void }
>(function TreeImport({ onDone, children, treeUuid, ...props }, ref) {
  const { mutate: overwriteTree } = useOverwriteImport({
    onSettled: () => onDone?.(),
  });

  return (
    <FileReaderInput
      ref={ref}
      onFileLoad={(event) => overwriteTree({ event, uuid: treeUuid })}
      {...props}
    >
      {children}
    </FileReaderInput>
  );
});
