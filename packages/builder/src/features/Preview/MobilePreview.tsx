import { Box } from "@open-legal-tech/design-system";
import * as React from "react";
import { RichTextEditor } from "components";
import { useTree } from "features/Builder/state/useTree";
import { useInterpreter } from "@open-decision/interpreter";
import { renderElement } from "./shared";
import { AnswersForm } from "./components/AnswersForm";

export function MobilePreview() {
  const [snapshot, interpreter] = useInterpreter();
  const [node, send] = useTree(
    (state) => state.treeData[interpreter.currentNode]
  );
  const relation = React.useMemo(
    () => snapshot.getAnswer(node.id),
    [node.id, snapshot]
  );

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
            <RichTextEditor.Editable
              css={{ marginBottom: "$6", paddingRight: "$2", minHeight: 0 }}
              renderElement={renderElement}
              readOnly
              placeholder="Dieser Knoten hat keinen Inhalt"
            />
          </RichTextEditor.Root>
          <AnswersForm
            interpreter={interpreter}
            snapshot={snapshot}
            node={node}
            relation={relation}
            key={`form_${node.id}`}
          />
        </Box>
      </Box>
    </Box>
  );
}
