import { Box, Button, Heading, Text } from "@open-legal-tech/design-system";
import { BaseHeader, EditorHeader } from "components/Header";
import { MainContent } from "components/Layout";
import { NodeEditor } from "features/Builder/NodeEditor";
import { EditorProvider } from "features/Builder/state/useEditor";
import { TreeProvider, useTree } from "features/Builder/state/useTree";
import { sidebarWidth } from "features/Builder/utilities/constants";
import { ReactFlowProvider } from "react-flow-renderer";
import Image from "next/image";

export default function Tree(): JSX.Element {
  return (
    <MainContent
      css={{
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: `1fr ${sidebarWidth}px`,
        gridTemplateRows: "70px 1fr",
      }}
    >
      <ReactFlowProvider>
        <TreeProvider>
          <EditorProvider>
            <Editor />
          </EditorProvider>
        </TreeProvider>
      </ReactFlowProvider>
    </MainContent>
  );
}

const Editor = () => {
  const [state, send] = useTree();

  if (state.matches("idle"))
    return (
      <>
        <EditorHeader css={{ gridColumn: "1 / -1", gridRow: "1" }} />
        <NodeEditor css={{ gridColumn: "1 / -1", gridRow: "2" }} />
      </>
    );

  if (state.matches("empty"))
    return (
      <>
        <BaseHeader css={{ gridColumn: "1 / -1", gridRow: "1" }} />
        <Box
          css={{
            gridColumn: "1 / -1",
            gridRow: "2",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Image src="/EmptyIllustration.png" width={700} height={500} />
          <Box
            as="header"
            css={{
              gap: "$4",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "$7",
            }}
          >
            <Heading size="large">Kein aktives Projekt</Heading>
            <Text size="large" css={{ color: "$gray11" }}>
              Erstelle oder importiere dein erstes Projekt um zu starten.
            </Text>
          </Box>
          <Box css={{ display: "flex", gap: "$4", marginTop: "$7" }}>
            <Button variant="secondary" disabled>
              Importieren
            </Button>
            <Button
              onClick={() =>
                send({
                  type: "createTree",
                  name:
                    prompt("Bitte gib deinem Projekt einen Namen") ??
                    "Unbennantes Projekt",
                })
              }
            >
              Neues Projekt erstellen
            </Button>
          </Box>
        </Box>
      </>
    );

  return (
    <>
      <BaseHeader css={{ gridColumn: "1 / -1", gridRow: "1" }} />
      <Box
        css={{
          gridColumn: "1 / -1",
          gridRow: "2",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Heading size="large">Der Editor konnte nicht gestartet werden</Heading>
      </Box>
    </>
  );
};
