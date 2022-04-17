import {
  Button,
  Heading,
  Icon,
  Stack,
  styled,
} from "@open-decision/design-system";
import { ErrorBoundary } from "@sentry/nextjs";
import { BaseHeader, MainContent } from "components";
import { CreateTreeDialog } from "features/Dashboard/components/Dialogs/CreateTreeDialog";
import { TreeList } from "features/Dashboard/TreeList";
import { ErrorFallback } from "features/Error/ErrorFallback";
import * as React from "react";
import { RocketIcon } from "@radix-ui/react-icons";
import { FileImport } from "features/Dashboard/TreeImport";

const DashboardGrid = styled(MainContent, {
  display: "grid",
  height: "100vh",
  overflow: "hidden",
  gridTemplateRows: "max-content max-content 1fr",
  gridTemplateColumns: `1fr min(1000px, 90%) 1fr`,
  layer: "3",
});

export default function DashboardPage() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
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
          <Stack
            css={{ flexDirection: "row", gap: "$3", alignItems: "center" }}
          >
            <FileImport />
            <CreateTreeDialog>
              <Button>
                <Icon css={{ marginTop: "2px" }}>
                  <RocketIcon />
                </Icon>
                Neues Projekt erstellen
              </Button>
            </CreateTreeDialog>
          </Stack>
        </Stack>
        <TreeList />
      </DashboardGrid>
    </ErrorBoundary>
  );
}
