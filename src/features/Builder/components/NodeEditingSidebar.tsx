import { styled, Box, Input, Heading } from "@open-legal-tech/design-system";
import { useActor } from "@xstate/react";
import { SingleSelect } from "features/Builder/components/SingleSelect/SingleSelect";
import { RichTextEditor } from "components/RichTextEditor";
import { useTree } from "features/Builder/hooks/useTree";

import React from "react";

const SidebarHeading = styled(Heading, {});

export const NodeEditingSidebar = (): JSX.Element => {
  const service = useTree();
  const [state, send] = useActor(service);

  if (!state.matches("idle")) {
    <p>Momentan kann kein Knoten bearbeitet werden</p>;
  }

  return node?.data ? (
    <>
      <Box as="header">
        <Input
          css={{ width: "100%" }}
          value={node.data.label}
          onChange={(event) =>
            setNode(node.id, { data: { label: event.target.value } })
          }
          maxLength={30}
        />
      </Box>
      <Box as="section">
        <SidebarHeading className="text-lg font-semibold">
          Inhalt
        </SidebarHeading>
        <RichTextEditor />
      </Box>
      <Box as="section">
        <SingleSelect inputs={node.content.inputs} />
      </Box>
    </>
  ) : (
    <p>Bitte wähle einen Knoten aus</p>
  );
};
