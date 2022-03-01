import { BuilderTree } from "@open-decision/type-classes";
import {
  Box,
  Button,
  Heading,
  LoadingSpinner,
  Stack,
  styled,
} from "@open-decision/design-system";
import { ErrorBoundary } from "@sentry/nextjs";
import { BaseHeader, FileInput, MainContent } from "components";
import { CreateTreeDialog } from "features/Dashboard/components/Dialogs/CreateTreeDialog";
import { TreeList } from "features/Dashboard/TreeList";
import {
  useCreateTreeMutation,
  useTreesQuery,
} from "features/Data/generated/graphql";
import { queryClient } from "features/Data/queryClient";
import { ErrorFallback } from "features/Error/ErrorFallback";
import { useNotificationStore } from "features/Notifications/NotificationState";
import Image from "next/image";
import * as React from "react";
import { QueryClientProvider } from "react-query";

export default function DashboardPage() {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

const DashboardGrid = styled(MainContent, {
  display: "grid",
  height: "100vh",
  overflow: "hidden",
  gridTemplateRows: "max-content max-content 1fr",
  gridTemplateColumns: `1fr min(1000px, 90%) 1fr`,
  layer: "4",
});

function Dashboard() {
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const { data: trees, isLoading } = useTreesQuery();
  const { mutate: saveTree } = useCreateTreeMutation({
    onSuccess: () => queryClient.invalidateQueries("Trees"),
  });

  const hasTrees = trees && trees?.decisionTrees.length > 0;

  return (
    <DashboardGrid>
      <BaseHeader css={{ gridColumn: "1 / -1" }} />
      <Stack
        css={{
          gridColumn: 2,
          flexDirection: "row",
          marginBlock: "$10 $8",
          justifyContent: "space-between",
        }}
      >
        <Heading size="large">Meine Projekte</Heading>
        <Stack css={{ flexDirection: "row", gap: "$3", alignItems: "center" }}>
          <FileInput
            onChange={(event) => {
              if (!event.currentTarget.files?.[0]) return;

              const fileReader = new FileReader();
              fileReader.onload = function (event) {
                const result = event.target?.result;
                if (typeof result !== "string") return;

                const parsedResult = JSON.parse(result);

                const validatedResult =
                  BuilderTree.Type.safeParse(parsedResult);

                if (!validatedResult.success) {
                  return addNotification({
                    title: "Ungültiger Inhalt",
                    content:
                      "Die importierte Datei ist kein valider Entscheidungsbaum.",
                    variant: "danger",
                  });
                }

                return saveTree({
                  data: {
                    name: validatedResult.data.name,
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
          <CreateTreeDialog>
            <Button>Neues Projekt erstellen</Button>
          </CreateTreeDialog>
        </Stack>
      </Stack>
      <Stack
        css={{
          justifyContent: !hasTrees ? "center" : undefined,
          overflow: "auto",
          marginInline: "-$4",
          gridColumn: 2,
          height: "100%",
        }}
      >
        {isLoading ? (
          <Stack center css={{ height: "100%" }}>
            <LoadingSpinner width="50px" />
          </Stack>
        ) : hasTrees ? (
          <TreeList data={trees.decisionTrees} />
        ) : (
          <Box
            css={{
              transform: "scaleX(-1)",
              height: "70%",
              width: "100%",
              position: "relative",
            }}
          >
            <Image
              src="/EmptyIllustration.png"
              layout="fill"
              objectFit="contain"
              priority
            />
          </Box>
        )}
      </Stack>
    </DashboardGrid>
  );
}
