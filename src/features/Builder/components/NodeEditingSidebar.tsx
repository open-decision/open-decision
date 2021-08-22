import * as React from "react";
import { Box, Input, Heading } from "@open-legal-tech/design-system";
import { SingleSelect } from "features/Builder/components/SingleSelect/SingleSelect";
import { RichTextEditor } from "components/RichTextEditor";
import { useTree } from "features/Builder/state/useTree";
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
        <Input
          css={{ width: "100%" }}
          value={node.data?.label ?? ""}
          onChange={(event) =>
            service.send({
              type: "updateNode",
              id,
              data: { data: { label: event.target.value } },
            })
          }
          maxLength={30}
        />
      </Box>
      <Box as="section">
        <Heading className="text-lg font-semibold">Inhalt</Heading>
        <RichTextEditor />
      </Box>
      <Box as="section">
        <SingleSelect node={node} />
      </Box>
    </>
  ) : (
    <p>Bitte wähle einen Knoten aus</p>
  );
}
