import * as React from "react";
import { Tree } from "@open-decision/type-classes";
import { FileInput } from "../../components";
import { useNotificationStore } from "../../features/Notifications/NotificationState";
import { z } from "zod";

import { FileInputProps } from "../../components/FileInput";
import { useTreeAPI } from "../Data/useTreeAPI";

const TreeImportType = Tree.Type.extend({ name: z.string() });

export const TreeImport = React.forwardRef<
  HTMLLabelElement,
  Omit<FileInputProps, "children"> & { onDone?: () => void }
>(function TreeImport({ onDone, ...props }, ref) {
  const { addNotification } = useNotificationStore();

  const { mutate: createTree } = useTreeAPI().useImport({
    onSuccess: () => onDone?.(),
  });

  return (
    <FileInput
      ref={ref}
      onChange={(event) => {
        if (!event.currentTarget.files?.[0]) return;

        const fileReader = new FileReader();
        fileReader.onload = function (event) {
          const result = event.target?.result;
          if (typeof result !== "string") return;

          const parsedResult = JSON.parse(result);

          const validatedResult = TreeImportType.safeParse(parsedResult);

          if (!validatedResult.success) {
            return addNotification({
              title: "Ungültiger Inhalt",
              content:
                "Die importierte Datei ist kein valider Entscheidungsbaum.",
              variant: "danger",
            });
          }

          const { name, ...data } = validatedResult.data;

          return createTree({ name, data });
        };

        fileReader.readAsText(event.currentTarget.files?.[0]);
        event.target.value = "";
      }}
      {...props}
    >
      Projekt importieren
    </FileInput>
  );
});
