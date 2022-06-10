import * as React from "react";
import { Tree } from "@open-decision/type-classes";
import { FileInput } from "../../components";
import { queryClient } from "../../features/Data/queryClient";
import { useNotificationStore } from "../../features/Notifications/NotificationState";
import { z } from "zod";
import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { proxy } from "valtio";
import { bindProxyAndYMap } from "valtio-yjs";
import { FileInputProps } from "../../components/FileInput";
import { useOD } from "../Data/odClient";
import { useMutation } from "react-query";

const TreeImportType = Tree.Type.extend({ name: z.string() });

export const TreeImport = React.forwardRef<
  HTMLLabelElement,
  Omit<FileInputProps, "children">
>(function TreeImport(props, ref) {
  const [importedData, setImportedData] = React.useState<
    Tree.TTree | undefined
  >();
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const OD = useOD();

  const { mutate: createTree } = useMutation(
    (name: string) => OD.trees.create({ body: { name } }),
    {
      onSuccess: ({ uuid }) => {
        if (!importedData) return;

        const yDoc = new Y.Doc();
        const yMap = yDoc.getMap("tree");
        new IndexeddbPersistence(uuid, yDoc);
        const importStore = proxy(importedData);
        bindProxyAndYMap(importStore, yMap);

        return queryClient.invalidateQueries("Trees");
      },
    }
  );

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

          setImportedData(data);

          return createTree(name);
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
