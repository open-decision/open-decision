import { BuilderTree } from "@open-decision/type-classes";
import { Box, Heading, Stack, styled } from "@open-legal-tech/design-system";
import { Separator } from "@radix-ui/react-separator";
import { ErrorBoundary } from "@sentry/nextjs";
import { BaseHeader, FileInput, MainContent } from "components";
import { LoadingSpinner } from "components/LoadingSpinner";
import { TreeProvider } from "features/Builder/state/useTree";
import { NewTreeButton } from "features/Dashboard/NewTreeButton";
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
    <MainContent
      css={{
        overflow: "hidden",
        display: "grid",
        gridTemplateRows: "max-content 1fr",
      }}
    >
      <ErrorBoundary fallback={ErrorFallback}>
        <QueryClientProvider client={queryClient}>
          <TreeProvider>
            <Dashboard />
          </TreeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </MainContent>
  );
}

const DashboardGrid = styled(MainContent, {
  display: "grid",
  height: "100%",
  gridTemplateRows: "max-content max-content max-content 1fr",
  gridTemplateColumns: `1fr min(1000px, 100%) 1fr`,
  backgroundColor: "$gray2",
});

const StyledSeparator = styled(Separator, {
  gridColumn: 2,
  height: "1px",
  backgroundColor: "$gray7",
  marginBlock: "$6",
});

function Dashboard() {
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const { data: trees, isLoading } = useTreesQuery();
  const { mutate: saveTree } = useCreateTreeMutation({
    onSuccess: () => queryClient.invalidateQueries("Trees"),
  });

  return (
    <DashboardGrid>
      <BaseHeader css={{ gridRow: 1, gridColumn: "1 / -1" }} />
      <Stack
        css={{
          flexDirection: "row",
          gridColumn: 2,
          marginTop: "$10",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <Heading size="large">Meine Projekte</Heading>
        <Stack css={{ flexDirection: "row", gap: "$4" }}>
          <FileInput
            size="small"
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
                    variant: "error",
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
          <NewTreeButton size="small">Neues Projekt erstellen</NewTreeButton>
        </Stack>
      </Stack>
      <StyledSeparator />
      <Stack
        css={{
          gridColumn: 2,
          overflow: "hidden",
        }}
      >
        {isLoading ? (
          <Stack center css={{ height: "100%" }}>
            <LoadingSpinner />
          </Stack>
        ) : trees && trees?.decisionTrees.length > 0 ? (
          <TreeList data={trees.decisionTrees} />
        ) : (
          <Box
            css={{
              transform: "scaleX(-1)",
              height: "100%",
              width: "100%",
              position: "relative",
            }}
          >
            <Image
              src="/EmptyIllustration.png"
              layout="fill"
              objectFit="contain"
            />
          </Box>
        )}
      </Stack>
    </DashboardGrid>
  );
}
