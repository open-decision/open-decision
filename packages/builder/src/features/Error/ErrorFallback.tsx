import { Box, Heading, Link, Text } from "@open-legal-tech/design-system";
import { BaseHeader, MainContent } from "components";
import { sidebarWidth } from "features/Builder/utilities/constants";

export function ErrorFallback() {
  return (
    <MainContent
      css={{
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: `1fr ${sidebarWidth}px`,
        gridTemplateRows: "max-content 1fr",
        width: "100vw",
      }}
    >
      <BaseHeader css={{ gridColumn: "1 / -1", gridRow: "1" }} />
      <Box
        css={{
          gridColumn: "1 / -1",
          gridRow: "2",
          display: "flex",
          maxWidth: "700px",
          justifyContent: "center",
          justifySelf: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Heading>Es ist ein Fehler aufgetreten.</Heading>
        <Text size="large" css={{ marginTop: "$3" }}>
          Bitte lade die Seite neu. Sollte der Fehler erneut auftreten dann
          erstelle bitte einen Bugreport hier:{" "}
          <Link href="https://www.notion.so/openlegaltech/a8a6b8db7e2b485294b6e31c1b3ae9da?v=ae3429d3f8d04d3395126baaa8147fe5">
            Feedback Formular
          </Link>
        </Text>
      </Box>
    </MainContent>
  );
}
