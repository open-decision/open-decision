import { Box } from "@open-legal-tech/design-system";
import * as React from "react";
import { RichTextEditor } from "components";
import { useTree } from "features/Builder/state/useTree";
import { useInterpreter } from "@open-decision/interpreter";
import { renderElement } from "./shared";
import { AnswersForm } from "./components/AnswersForm";

export function Preview() {
  const [snapshot, interpreter] = useInterpreter();
  const [node, send] = useTree((state) => state.nodes[interpreter.currentNode]);
  const relation = React.useMemo(
    () => snapshot.getAnswer(node?.id),
    [node?.id, snapshot]
  );

  return (
    <Box
      css={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr 1fr",
        height: "100%",
        backgroundColor: "$gray2",
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
        <AnswersForm
          relation={relation}
          node={node}
          interpreter={interpreter}
          snapshot={snapshot}
          key={`form_${node.id}`}
        />
      </Box>
    </Box>
  );
}

function PreviewRichTextEditor() {
  return (
    <Box
      css={{
        marginBlock: "$8",
        overflow: "hidden",
        maxHeight: "800px",
      }}
    >
      <RichTextEditor.Editable
        css={{
          gridRow: "2",
          paddingInlineEnd: "$8",
          minHeight: 0,
        }}
        readOnly
        renderElement={renderElement}
        placeholder="Dieser Knoten hat keinen Inhalt"
      />
    </Box>
  );
}