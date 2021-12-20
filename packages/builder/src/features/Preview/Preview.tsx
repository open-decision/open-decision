import { Box, Button } from "@open-legal-tech/design-system";
import * as React from "react";
import { RichTextEditor } from "components";
import { useTree } from "features/Builder/state/useTree";
import { useSlate } from "slate-react";
import { useInterpreter } from "@open-decision/interpreter";
import { renderElement } from "./shared";

export function Preview() {
  const [snapshot, interpreter] = useInterpreter();
  const [node, send] = useTree((state) => state.nodes[interpreter.currentNode]);

  return (
    <Box
      css={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr 1fr",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Box css={{ gridColumn: "2" }}>
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
            marginBottom: "$8",
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
        {snapshot.hasHistory ? (
          <Button variant="secondary" onClick={() => interpreter.goBack()}>
            Zurück
          </Button>
        ) : null}
      </Box>
    </Box>
  );
}

function PreviewRichTextEditor() {
  const editor = useSlate();

  return (
    <Box
      css={{
        display: "grid",
        gridTemplateRows: "50px 1fr",
        gap: "$2",
        marginBottom: "$4",
        overflow: "hidden",
        maxHeight: "800px",
      }}
    >
      {editor.selection ? (
        <RichTextEditor.Toolbar
          css={{
            maxWidth: "max-content",
            borderRadius: "$md",
          }}
        />
      ) : null}
      <RichTextEditor.Editable
        css={{ gridRow: "2", paddingInlineEnd: "$8" }}
        renderElement={renderElement}
      />
    </Box>
  );
}
