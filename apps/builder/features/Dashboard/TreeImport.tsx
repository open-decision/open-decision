import * as React from "react";
import { FileInput } from "../../components";
import { FileInputProps } from "../../components/FileInput";
import { useTreeAPI } from "../Data/useTreeAPI";

export const TreeImport = React.forwardRef<
  HTMLLabelElement,
  FileInputProps & { onDone?: () => void }
>(function TreeImport({ onDone, children, ...props }, ref) {
  const { mutate: createTree } = useTreeAPI().useImport({
    onSettled: () => onDone?.(),
  });

  return (
    <FileInput
      ref={ref}
      onChange={(event) => {
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
          createTree({ event });
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
});
