import { Box, Heading, Input } from "@open-legal-tech/design-system";
import { RichTextEditor } from "components/RichTextEditor";
import { SingleSelectInputs } from "features/Builder/components/SingleSelect/SingleSelect";
import { useTree } from "features/Builder/state/useTree";
import * as React from "react";
import { useNode } from "../state/useNode";

type NodeEditingSidebarProps = { id: string };

export function NodeEditingSidebar({
  id,
}: NodeEditingSidebarProps): JSX.Element {
  const service = useTree();
  const node = useNode(id);

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
              id,
              data: { label: event.target.value },
            })
          }
          maxLength={30}
        />
      </Box>
      <Box as="section">
        <Heading>Inhalt</Heading>
        <RichTextEditor />
      </Box>
      <Box as="section">
        <SingleSelectInputs node={node} />
      </Box>
    </>
  ) : (
    <p>Bitte wähle einen Knoten aus</p>
  );
}
