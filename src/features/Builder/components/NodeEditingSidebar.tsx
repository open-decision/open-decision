import { Box, Heading, Input } from "@open-legal-tech/design-system";
import { RichTextEditor } from "components/RichTextEditor";
import { SingleSelectInputs } from "features/Builder/components/SingleSelect/SingleSelect";
import { useTree } from "features/Builder/state/useTree";
import * as React from "react";
import { useNode } from "../state/useNode";

type NodeEditingSidebarProps = { nodeId: string };

export function NodeEditingSidebar({
  nodeId,
}: NodeEditingSidebarProps): JSX.Element {
  const service = useTree();
  const node = useNode(nodeId);

  return node ? (
    <>
      <Box as="header">
        <Heading>Titel</Heading>
        <Input
          css={{ width: "100%" }}
          value={node.data?.label ?? ""}
          onChange={(event) =>
            service.send({
              type: "updateNodeData",
              nodeId,
              data: { label: event.target.value },
            })
          }
          maxLength={70}
        />
      </Box>
      <Box as="section">
        <Heading>Inhalt</Heading>
        <RichTextEditor
          css={{ minHeight: "500px" }}
          value={node.data.content}
          setValue={(newValue) =>
            service.send({
              type: "updateNodeData",
              nodeId,
              data: { content: newValue },
            })
          }
        />
      </Box>
      <Box as="section">
        <SingleSelectInputs node={node} />
      </Box>
    </>
  ) : (
    <p>Bitte wähle einen Knoten aus</p>
  );
}
