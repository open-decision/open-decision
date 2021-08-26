import {
  Box,
  Button,
  Heading,
  IconButton,
  Input,
  styled,
} from "@open-legal-tech/design-system";
import * as Accordion from "@radix-ui/react-accordion";
import {
  ChevronDownIcon,
  CornerBottomLeftIcon,
  Cross1Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useSelector } from "@xstate/react";
import { TreeState } from "features/Builder/state/createTreeMachine";
import { useEditor } from "features/Builder/state/useEditor";
import { useTree } from "features/Builder/state/useTree";
import { TNode } from "features/Builder/types";
import * as React from "react";
import { nanoid } from "nanoid/non-secure";
import { UpdateInputEvent } from "features/Builder/state/stateUpdaterFunctions";

const StyledAccordionRoot = styled(Accordion.Root, {
  display: "grid",
  gap: "$2",
});

type SingleSelectProps = { node: TNode };

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
          onClick={() => service.send({ type: "addInput", nodeId: node.id })}
        />
      </Box>
      <StyledAccordionRoot type="multiple">
        {node.data.inputs.map((input) => (
          <SingleSelectInput
            key={input.id}
            onChange={(event) =>
              service.send({
                type: "updateInput",
                nodeId: node.id,
                inputId: input.id,
                input: { value: event.target.value },
              })
            }
            onDelete={() =>
              service.send({
                type: "deleteInput",
                nodeId: node.id,
                inputId: input.id,
              })
            }
            value={input.value ?? ""}
            position={input.position}
            target={input.target}
            id={input.id}
            nodeId={node.id}
          />
        ))}
      </StyledAccordionRoot>
    </>
  );
}

const StyledAccordionContainer = styled(Accordion.Item, {
  display: "grid",
  gridTemplateColumns: "max-content 1fr 50px",

  "&[data-state=open]": {
    gridTemplateRows: "1fr 1fr",
  },
  "&[data-state=closed]": {
    gridTemplateRows: "1fr",
  },
});

const StyledAccordionContent = styled(Accordion.Content, {
  gridColumn: "1 / -1",
  display: "flex",
  alignItems: "center",
});

type Input = { id: string; value?: string; position: number; target?: string };

type SingleSelectInputProps = Input & {
  nodeId: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onDelete: (id: string) => void;
};

export function SingleSelectInput({
  id,
  nodeId,
  target,
  value,
  position,
  onChange,
  onDelete,
}: SingleSelectInputProps): JSX.Element {
  return (
    <StyledAccordionContainer value={id}>
      <Accordion.Header
        as={Box}
        css={{
          display: "grid",
          gridColumn: "1 / -1",
          gridTemplateColumns: "inherit",
          $$radius: "$radii$lg",
          $$border: "2px solid $colors$gray5",
        }}
      >
        <Accordion.Trigger
          css={{
            border: "$$border",
            borderRadius: "$none",
            borderTopLeftRadius: "$$radius",
            borderBottomLeftRadius: "$$radius",
          }}
          as={IconButton}
          label="Öffne die Verbindungen"
          variant="ghost"
          Icon={<ChevronDownIcon />}
        >
          {position}
        </Accordion.Trigger>
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
          value={value}
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
          onClick={(_event) => onDelete(id)}
        />
      </Accordion.Header>
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
          <NodeLink target={target} />
          <SelectNodeDropdown nodeId={nodeId} inputId={id} target={target} />
        </Box>
      </StyledAccordionContent>
    </StyledAccordionContainer>
  );
}

type SelectNodeDropDownProps = {
  nodeId: string;
  inputId: string;
  target?: string;
};

const StyledSelect = styled("select", {
  backgroundColor: "$gray4",
  borderRadius: "$md",
  padding: "$1 $2",
});

const getNodeOptions = (state: TreeState) =>
  Object.entries(state.context.nodes).map(([key, value]) => ({
    id: key,
    name: value.data.label,
  }));

function SelectNodeDropdown({
  nodeId,
  inputId,
  target,
}: SelectNodeDropDownProps) {
  const service = useTree();
  const data = useSelector(service, getNodeOptions);
  const node = useSelector(service, (state) => state.context.nodes[nodeId]);

  console.log(node);

  function createUpdateInputEvent(target: string) {
    return {
      type: "updateInput",
      nodeId,
      inputId,
      input: { target },
    } as UpdateInputEvent;
  }

  function createNewAssociatedNode() {
    const id = nanoid(5);
    const position = { x: node.position.x, y: node.position.y + 80 };

    service.send([
      {
        type: "addNode",
        value: {
          id,
          position,
          type: "default",
          data: { inputs: [], content: [], label: "Neuer Knoten" },
        },
      },
      {
        type: "addEdge",
        connection: {
          source: nodeId,
          sourceHandle: null,
          target: id,
          targetHandle: null,
        },
      },
      createUpdateInputEvent(id),
    ]);
  }

  return (
    <Box css={{ display: "flex" }}>
      {/* eslint-disable-next-line jsx-a11y/no-onchange */}
      <StyledSelect
        value={target ?? ""}
        onChange={(event) =>
          service.send(createUpdateInputEvent(event.target.value))
        }
      >
        <option value="">Wähle den Zielknoten</option>
        {data.map((node) => (
          <option disabled={node.id === nodeId} value={node.id} key={node.id}>
            {node.name}
          </option>
        ))}
      </StyledSelect>
      {target ? (
        <IconButton
          onClick={() =>
            service.send({
              type: "updateInput",
              nodeId,
              inputId,
              input: { target: undefined },
            })
          }
          Icon={<Cross1Icon />}
          label="Entferne den Zielknoten"
        />
      ) : (
        <IconButton
          variant="tertiary"
          Icon={<PlusIcon />}
          label="Füge einen neuen Knoten hinzu und verknüpfe ihn mit diesem Input"
          onClick={createNewAssociatedNode}
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
