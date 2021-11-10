import {
  Box,
  Button,
  Heading,
  Text,
  Dialog,
  Label,
  Input,
  Form,
  ValidationMessage,
} from "@open-legal-tech/design-system";
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
        gridTemplateRows: "60px 1fr",
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
          }}
        >
          <Box
            css={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box css={{ transform: "scaleX(-1)" }}>
              <Image src="/EmptyIllustration.png" width={700} height={500} />
            </Box>
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
              <Heading>Kein aktives Projekt</Heading>
              <Text size="large" css={{ color: "$gray11" }}>
                Erstelle oder importiere dein erstes Projekt um zu starten.
              </Text>
            </Box>
            <Box
              css={{
                display: "flex",
                width: "100%",
                gap: "$4",
                marginTop: "$7",
                justifyContent: "center",
              }}
            >
              <Button variant="secondary" disabled>
                Importieren
              </Button>
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <Button>Neues Projekt erstellen</Button>
                </Dialog.Trigger>
                <Dialog.Content css={{ minWidth: "350px", paddingTop: "$2" }}>
                  <Box
                    css={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "$6",
                      alignItems: "center",
                    }}
                  >
                    <Dialog.Title asChild>
                      <Heading size="extra-small">
                        Neues Projekt erstellen
                      </Heading>
                    </Dialog.Title>
                    <Dialog.CloseButton />
                  </Box>
                  <Form
                    initialValues={{ treeName: "" }}
                    css={{ display: "flex", flexDirection: "column" }}
                    onSubmit={({ values }) => {
                      return send({
                        type: "createTree",
                        name: values.treeName,
                      });
                    }}
                  >
                    <Dialog.Description asChild>
                      <Label size="small" htmlFor="treeName">
                        Projektname
                      </Label>
                    </Dialog.Description>
                    <Input
                      name="treeName"
                      id="treeName"
                      css={{ marginBlock: "$2" }}
                      required
                    />
                    <ValidationMessage name="treeName" />

                    <Button
                      size="small"
                      variant="secondary"
                      css={{
                        colorScheme: "success",
                        alignSelf: "end",
                        marginTop: "$6",
                      }}
                      type="submit"
                    >
                      Erstellen
                    </Button>
                  </Form>
                </Dialog.Content>
              </Dialog.Root>
            </Box>
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
