import { BuilderTree } from "@open-decision/type-classes";
import { FileInput } from "components";
import { useCreateTreeMutation } from "features/Data/generated/graphql";
import { queryClient } from "features/Data/queryClient";
import { useNotificationStore } from "features/Notifications/NotificationState";

export function FileImport() {
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const { mutate: createTree } = useCreateTreeMutation({
    onSuccess: () => queryClient.invalidateQueries("Trees"),
  });

  return (
    <FileInput
      onChange={(event) => {
        if (!event.currentTarget.files?.[0]) return;

        const fileReader = new FileReader();
        fileReader.onload = function (event) {
          const result = event.target?.result;
          if (typeof result !== "string") return;

          const parsedResult = JSON.parse(result);

          const validatedResult = BuilderTree.Type.safeParse(parsedResult);

          if (!validatedResult.success) {
            return addNotification({
              title: "Ungültiger Inhalt",
              content:
                "Die importierte Datei ist kein valider Entscheidungsbaum.",
              variant: "danger",
            });
          }

          return createTree({
            data: {
              name: validatedResult.data?.name ?? "",
              treeData: validatedResult.data.treeData,
            },
          });
        };

        fileReader.readAsText(event.currentTarget.files?.[0]);
        event.target.value = "";
      }}
    >
      Projekt importieren
    </FileInput>
  );
}
