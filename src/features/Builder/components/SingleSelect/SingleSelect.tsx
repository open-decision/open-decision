import {
  Box,
  Button,
  Heading,
  IconButton,
  Input,
  styled,
} from "@open-legal-tech/design-system";
import {
  ChevronDownIcon,
  CornerBottomLeftIcon,
  Cross1Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useSelector } from "@xstate/react";
import { useEditor } from "features/Builder/state/useEditor";
import { useTree } from "features/Builder/state/useTree";
import * as React from "react";
import { createNewAssociatedNode } from "features/Builder/state/assignUtils";
import * as Node from "features/Builder/types/Node";
import * as Tree from "features/Builder/types/Tree";
import * as Record from "fp-ts/Record";
import { pipe } from "fp-ts/lib/function";

const StyledAccordionRoot = styled(Box, {
  display: "grid",
  gap: "$2",
});

type SingleSelectProps = { node: Node.TNode };

export function SingleSelectInputs({ node }: SingleSelectProps) {
  const service = useTree();

  return (
    <>
      <Box
        css={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Heading>
          Pfade{" "}
          <Box css={{ color: "$gray11" }} as="span">
            / Einfachauswahl
          </Box>
        </Heading>
        <IconButton
          variant="tertiary"
          css={{ colorScheme: "success" }}
          Icon={<PlusIcon style={{ width: "30px", height: "30px" }} />}
          label="Neue Antwortmöglichkeit hinzufügen"
          onClick={() => service.send({ type: "addRelation", nodeId: node.id })}
        />
      </Box>
      <StyledAccordionRoot>
        {Object.values(node.data.relations).map((relation) => (
          <SingleSelectInput
            key={relation.id}
            input={relation}
            onChange={(event) =>
              service.send({
                type: "updateRelation",
                nodeId: node.id,
                relationId: relation.id,
                value: { target: event.target.value },
              })
            }
            onDelete={() =>
              service.send({
                type: "deleteRelation",
                nodeId: node.id,
                relationIds: [relation.id],
              })
            }
            nodeId={node.id}
          />
        ))}
      </StyledAccordionRoot>
    </>
  );
}

const StyledAccordionContainer = styled(Box, {
  display: "grid",
  gridTemplateColumns: "max-content 1fr 50px",
  gap: "$2",

  "&[data-state=open]": {
    gridTemplateRows: "1fr 1fr",
  },
  "&[data-state=closed]": {
    gridTemplateRows: "1fr",
  },
});

const StyledAccordionContent = styled(Box, {
  gridColumn: "1 / -1",
  display: "flex",
  alignItems: "center",
});

type SingleSelectInputProps = {
  input: Node.TRelation;
  nodeId: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onDelete: (id: string) => void;
};

export function SingleSelectInput({
  input,
  nodeId,
  onChange,
  onDelete,
}: SingleSelectInputProps): JSX.Element {
  return (
    <StyledAccordionContainer>
      <Box
        css={{
          display: "grid",
          gridColumn: "1 / -1",
          gridTemplateColumns: "inherit",
          $$radius: "$radii$lg",
          $$border: "2px solid $colors$gray5",
        }}
      >
        <IconButton
          css={{
            border: "$$border",
            borderRadius: "$none",
            borderTopLeftRadius: "$$radius",
            borderBottomLeftRadius: "$$radius",
          }}
          label="Öffne die Verbindungen"
          variant="ghost"
          Icon={<ChevronDownIcon />}
        />
        <Input
          css={{
            marginRight: "$2",
            boxShadow: "$none",
            border: "$$border",
            borderLeft: "$none",
            gridColumn: 2,
            borderTopRightRadius: "$$radius",
            borderBottomRightRadius: "$$radius",
          }}
          value={input.value ?? ""}
          onChange={onChange}
        />
        <IconButton
          css={{ colorScheme: "error", gridColumn: 3 }}
          variant="tertiary"
          label="Entferne den Input"
          Icon={
            <TrashIcon
              style={{
                width: "30px",
                height: "30px",
              }}
            />
          }
          onClick={(_event) => onDelete(input.id)}
        />
      </Box>
      <StyledAccordionContent>
        <Box css={{ width: "45px" }}>
          <CornerBottomLeftIcon
            style={{
              width: "30px",
              height: "30px",
              transform: "translate(10px, -6px)",
            }}
          />
        </Box>
        <Box css={{ gridColumn: 2, display: "flex", gap: "$1" }}>
          <NodeLink target={input.target} />
          <SelectNodeDropdown nodeId={nodeId} input={input} />
        </Box>
      </StyledAccordionContent>
    </StyledAccordionContainer>
  );
}

type SelectNodeDropDownProps = {
  nodeId: string;
  input: Node.TRelation;
};

const StyledSelect = styled("select", {
  backgroundColor: "$gray4",
  borderRadius: "$md",
  padding: "$1 $2",
});

function SelectNodeDropdown({ nodeId, input }: SelectNodeDropDownProps) {
  const service = useTree();
  const tree = useSelector(service, (state) => state.context);
  const node = useSelector(service, (state) => state.context.nodes[nodeId]);
  const nodeOptions = pipe(
    Tree.getConnectableNodes(node)(tree),
    Record.map((node) => ({ target: node.id, label: node.data.label }))
  );

  return (
    <Box css={{ display: "flex", gap: "$2" }}>
      {/* eslint-disable-next-line jsx-a11y/no-onchange */}
      <StyledSelect
        value={input.target ?? ""}
        onChange={(event) =>
          service.send({
            type: "updateRelation",
            nodeId,
            relationId: input.id,
            value: { target: event.target.value },
          })
        }
      >
        <option value="">Wähle den Zielknoten</option>
        {Object.values(nodeOptions).map((option) => (
          <option
            disabled={option.target === nodeId}
            value={option.target}
            key={option.target}
          >
            {option.target}
          </option>
        ))}
      </StyledSelect>
      {input.target ? (
        <IconButton
          variant="tertiary"
          css={{ colorScheme: "error" }}
          onClick={() =>
            service.send({
              type: "updateRelation",
              nodeId,
              relationId: input.id,
              value: {
                target: undefined,
              },
            })
          }
          Icon={<Cross1Icon />}
          label="Entferne den Zielknoten"
        />
      ) : (
        <IconButton
          variant="tertiary"
          css={{ colorScheme: "success" }}
          Icon={<PlusIcon />}
          label="Füge einen neuen Knoten hinzu und verknüpfe ihn mit diesem Input"
          onClick={() => service.send(createNewAssociatedNode(node))}
        />
      )}
    </Box>
  );
}

type NodeLinkProps = { target?: string };

function NodeLink({ target }: NodeLinkProps) {
  const { setSelectedNodeId } = useEditor();

  return (
    <Button
      variant={target ? "tertiary" : "ghost"}
      size="sm"
      onClick={() => (target ? setSelectedNodeId(target) : null)}
      disabled={!target}
    >
      GEHT ZU:
    </Button>
  );
}
