import { Box, Button } from "@open-legal-tech/design-system";
import * as React from "react";
import { RichTextEditor } from "components";
import { useTree } from "features/Builder/state/useTree";
import { useSlate } from "slate-react";
import { useInterpreter } from "@open-decision/interpreter";
import { renderElement } from "./shared";

export function MobilePreview() {
  const [snapshot, interpreter] = useInterpreter();
  const [node, send] = useTree((state) => state.nodes[interpreter.currentNode]);

  return (
    <Box
      css={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        css={{
          width: "400px",
          height: "700px",
          backgroundColor: "$gray1",
          padding: "$8",
          borderRadius: "$md",
          display: "flex",
          flexDirection: "column",
          gap: "$6",
        }}
      >
        <Box
          css={{
            display: "flex",
            flexDirection: "column",
            gap: "$2",
            flex: "1",
            overflow: "hidden",
          }}
        >
          <RichTextEditor.Root
            key={snapshot.currentNode}
            value={node.content}
            setValue={(newValue) =>
              send({
                type: "updateNode",
                id: snapshot.currentNode,
                node: { content: newValue },
              })
            }
          >
            <PreviewRichTextEditor />
          </RichTextEditor.Root>
          <Box
            css={{
              gap: "$2",
              display: "grid",
            }}
          >
            {Object.values(node.relations).map((relation) => (
              <Button
                key={relation.id}
                variant="tertiary"
                css={{
                  width: "min(200px, 100%)",
                  justifyContent: "start",
                  gap: "$3",
                  boxShadow: "$1",
                  padding: "$2 $3",
                }}
                onClick={() => interpreter.evaluateUserInput(relation)}
              >
                {relation.answer}
              </Button>
            ))}
          </Box>
        </Box>
        <Box css={{ display: "flex", alignItems: "flex-end" }}>
          {snapshot.hasHistory ? (
            <Button variant="secondary" onClick={() => interpreter.goBack()}>
              Zurück
            </Button>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}

function PreviewRichTextEditor() {
  const editor = useSlate();

  return (
    <>
      {editor.selection ? (
        <RichTextEditor.Toolbar
          css={{
            marginBottom: "$2",
            maxWidth: "max-content",
            borderRadius: "$md",
            position: "absolute",
            marginTop: "-60px",
          }}
        />
      ) : null}
      <RichTextEditor.Editable
        css={{ marginBottom: "$6", paddingRight: "$2" }}
        renderElement={renderElement}
      />
    </>
  );
}
