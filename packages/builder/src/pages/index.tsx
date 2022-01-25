import {
  Box,
  Button,
  Heading,
  Text,
  Dialog,
  Label,
  Input,
  ValidationMessage,
  Tooltip,
  useForm,
  Link,
} from "@open-legal-tech/design-system";
import { BaseHeader } from "components/Header";
import { MainContent } from "components/Layout";
import { NodeEditor } from "features/Builder/NodeEditor";
import { EditorProvider } from "features/Builder/state/useEditor";
import { useTree } from "features/Builder/state/useTree";
import { sidebarWidth } from "features/Builder/utilities/constants";
import { ReactFlowProvider } from "react-flow-renderer";
import Image from "next/image";
import { FileInput } from "components";
import { Upload } from "react-feather";
import { BuilderTree } from "@open-decision/type-classes";
import { EditorHeader } from "features/Builder/components/EditorHeader";
import { useNotificationStore } from "features/Notifications/NotificationState";
import { ErrorBoundary } from "@sentry/nextjs";
import { ErrorFallback } from "features/Error/ErrorFallback";

export default function Tree(): JSX.Element {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <MainContent
        css={{
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: `1fr ${sidebarWidth}px`,
          gridTemplateRows: "max-content 1fr",
        }}
      >
        <ReactFlowProvider>
          <EditorProvider>
            <Editor />
          </EditorProvider>
        </ReactFlowProvider>
      </MainContent>
    </ErrorBoundary>
  );
}

const Editor = () => {
  const [state, send] = useTree();
  const [Form, { register }] = useForm({ defaultValues: { treeName: "" } });

  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

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
            height: "100%",
          }}
        >
          <Box
            css={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
              width: "clamp(200px, 80vw, 800px)",
            }}
          >
            <Box
              css={{ transform: "scaleX(-1)", height: "60%", width: "100%" }}
            >
              <Image
                src="/EmptyIllustration.png"
                layout="fill"
                objectFit="contain"
              />
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
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
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
                            variant: "error",
                          });
                        }

                        return send({
                          type: "loadTree",
                          tree: validatedResult.data,
                        });
                      };

                      fileReader.readAsText(event.currentTarget.files?.[0]);
                      event.target.value = "";
                    }}
                  >
                    <Upload />
                  </FileInput>
                </Tooltip.Trigger>
                <Tooltip.Content sideOffset={5}>
                  <Tooltip.Arrow />
                  <Text>Importiere ein Projekt</Text>
                </Tooltip.Content>
              </Tooltip.Root>
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
                    css={{ display: "flex", flexDirection: "column" }}
                    onSubmit={({ treeName }) => {
                      return send({
                        type: "createTree",
                        name: treeName,
                      });
                    }}
                  >
                    <Dialog.Description asChild>
                      <Label size="small" htmlFor="treeName">
                        Projektname
                      </Label>
                    </Dialog.Description>
                    <Input
                      autoFocus
                      {...register("treeName", {
                        required: {
                          value: true,
                          message: "Es muss ein Name vergeben werden.",
                        },
                      })}
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
      ></Box>
    </>
  );
};
