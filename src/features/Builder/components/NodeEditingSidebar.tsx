import {
  Box,
  Button,
  Form,
  Heading,
  Icon,
  InlineInput,
} from "@open-legal-tech/design-system";
import { RichTextEditor } from "components/RichTextEditor";
import { SingleSelectInputs } from "features/Builder/components/SingleSelect/SingleSelect";
import { useTree } from "features/Builder/state/useTree";
import * as React from "react";
import { Edit2 } from "react-feather";
import { useNode } from "../state/useNode";

type NodeEditingSidebarProps = { nodeId: string };

export function NodeEditingSidebar({
  nodeId,
}: NodeEditingSidebarProps): JSX.Element {
  const service = useTree();
  const node = useNode(nodeId);

  return (
    <>
      <Box as="header">
        <Form
          onChange={({ values }) => {
            service.send({
              type: "updateNodeData",
              nodeId,
              data: { label: values.nodeName },
            });
          }}
          onSubmit={(data) => console.log(data)}
          initialValues={{ nodeName: node.data?.label ?? "" }}
        >
          <InlineInput
            borderless
            Icon={
              <Icon size="small" label="Editiere den Projektnamen">
                <Edit2 />
              </Icon>
            }
            css={{ textStyle: "medium-heading" }}
            name="nodeName"
            maxLength={70}
            alignByContent="left"
          />
        </Form>
      </Box>
      <Box as="section">
        <Heading size="extra-small" css={{ textTransform: "uppercase" }}>
          Parent-Nodes
        </Heading>
        <Box
          css={{
            display: "flex",
            gap: "$2",
            marginTop: "$2",
            flexWrap: "wrap",
          }}
        >
          <Button size="small" variant="tertiary">
            Asylrecht
          </Button>
          <Button size="small" variant="tertiary">
            Verkehrsrecht
          </Button>
        </Box>
      </Box>
      <Box as="section">
        <Heading
          size="extra-small"
          css={{ textTransform: "uppercase", marginBottom: "$2" }}
        >
          Inhalt
        </Heading>
        <RichTextEditor
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
  );
}
