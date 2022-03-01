import { Box } from "@open-decision/design-system";
import * as React from "react";
import { useInterpreter } from "@open-decision/interpreter";
import { AnswersForm } from "./components/AnswersForm";
import { useNode } from "features/Builder/state/treeStore/hooks";

export function Preview() {
  const [snapshot, interpreter] = useInterpreter();
  const node = useNode(interpreter.currentNode);

  if (!node)
    throw new Error(`The Mobile Preview could not retrieve the currentNode.`);

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
