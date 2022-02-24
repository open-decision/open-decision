import { Box } from "@open-legal-tech/design-system";
import * as React from "react";
import { useInterpreter } from "@open-decision/interpreter";
import { AnswersForm } from "./components/AnswersForm";
import { useNode } from "features/Builder/state/treeStore/hooks";

export function MobilePreview() {
  const [snapshot, interpreter] = useInterpreter();
  const node = useNode(interpreter.currentNode);

  if (!node)
    throw new Error(`The Mobile Preview could not retrieve the currentNode.`);

  const relation = React.useMemo(() => {
    return snapshot.getAnswer(node.id);
  }, [node.id, snapshot]);

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
