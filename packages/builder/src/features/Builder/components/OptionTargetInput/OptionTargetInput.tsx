import {
  Box,
  Button,
  ButtonProps,
  Combobox,
  ControlledInput,
  Icon,
  Input,
  Label,
  styled,
  useForm,
  focusStyle,
  Row,
} from "@open-decision/design-system";
import * as React from "react";
import { Edge, Input as InputType } from "@open-decision/type-classes";
import { filter, pipe, values } from "remeda";
import { DragHandle } from "./DragHandle";
import { Reorder, useDragControls } from "framer-motion";
import { map } from "remeda";
import {
  useConditionsOfNode,
  useEdgesOfNode,
  useNode,
  useNodes,
} from "features/Builder/state/treeStore/hooks";
import { useTreeContext } from "features/Builder/state/treeStore/TreeContext";
import { useNotificationStore } from "features/Notifications/NotificationState";
import { Crosshair2Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";

const StyledReorderGroup = styled(Reorder.Group, {
  listStyle: "none",
  padding: 0,
  display: "grid",
  gap: "$4",
});

type SingleSelectProps = {
  nodeId: string;
  input: InputType.TInput;
};

export function OptionTargetInputs({ nodeId, input }: SingleSelectProps) {
  const { addInputAnswer, createAnswer, updateInputAnswerOrder } =
    useTreeContext();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const edges = useEdgesOfNode(nodeId);
  const conditions = useConditionsOfNode(nodeId);

  return (
    <>
      <Box
        css={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "$2",
          marginBottom: "$3",
        }}
      >
        <Label as="h2" css={{ margin: 0, display: "block" }}>
          Pfade
        </Label>
        <Button
          size="small"
          variant="secondary"
          onClick={() => {
            const newAnswer = createAnswer({ text: "" });
            addInputAnswer(input.id, newAnswer);
          }}
        >
          <Icon label="Neue Antwortmöglichkeit hinzufügen">
            <PlusIcon />
          </Icon>
          Hinzufügen
        </Button>
      </Box>
      {input?.answers ? (
        <StyledReorderGroup
          ref={ref}
          axis="y"
          values={input?.answers}
          layoutScroll
          onReorder={(newOrder) => updateInputAnswerOrder(input.id, newOrder)}
        >
          {input.answers.map((answer) => {
            const edge = Object.values(edges).find((edge) => {
              if (!edge.conditionId || !conditions) return false;
              const condition = conditions[edge.conditionId];

              return condition.answerId === answer.id;
            });

            return (
              <OptionTargetInput
                nodeId={nodeId}
                answer={answer}
                edge={edge}
                inputId={input.id}
                key={answer.id}
                groupRef={ref}
              />
            );
          })}
        </StyledReorderGroup>
      ) : null}
    </>
  );
}
type SingleSelectInputProps = {
  answer: InputType.TAnswer;
  edge?: Edge.TEdge;
  nodeId: string;
  inputId: string;
  groupRef: React.MutableRefObject<HTMLDivElement | null>;
};

export function OptionTargetInput({
  answer,
  edge,
  inputId,
  nodeId,
  groupRef,
}: SingleSelectInputProps) {
  const nodes = useNodes();
  const node = useNode(nodeId);
  const {
    deleteInputAnswer,
    updateInputAnswer,
    getConnectableNodes,
    createAndAddEdge,
    relateConditionToNode,
    updateEdgeTarget,
    addNode,
    addCondition,
    createInput,
    addEdge,
    createChildNode,
    createCondition,
    createEdge,
    addInput,
    deleteEdges,
  } = useTreeContext();
  const { addNotification } = useNotificationStore();

  const allOptions: Combobox.Item[] = pipe(
    nodes,
    values,
    filter((node) => Boolean(node.data.name)),
    map((node) => ({
      id: node.id,
      label: node.data.name,
      labelIcon: (
        <Row
          css={{
            fontWeight: "500",
            alignItems: "center",
            color: "$primary11",
            gap: "$1",
            minWidth: "max-content",
          }}
        >
          Verbinden
        </Row>
      ),
    }))
  );

  const nodeOptions = node ? getConnectableNodes(node.id) : [];

  const controls = useDragControls();

  const ref = React.useRef<HTMLDivElement | null>(null);

  const [Form] = useForm({
    defaultValues: {
      answer: answer.text ?? "",
      target: edge?.target ?? "",
    },
  });

  return node ? (
    <Reorder.Item
      value={answer}
      dragListener={false}
      dragControls={controls}
      dragConstraints={groupRef}
    >
      <Form
        css={{
          display: "flex",
          position: "relative",
          gap: "$1",
          groupColor: "$colorScheme-text",
        }}
      >
        <Box
          ref={ref}
          css={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "max-content 1fr",
            borderRadius: "$md",
            layer: "2",
          }}
        >
          <ControlledInput
            name="answer"
            onChange={(event) =>
              updateInputAnswer(inputId, answer.id, event.target.value)
            }
          >
            {({ onBlur, ...field }) => (
              <Input
                css={{
                  borderRadius: "0",
                  borderTopLeftRadius: "inherit",
                  borderTopRightRadius: "inherit",
                  gridColumn: "1 / -1",
                  marginBottom: "-1px",
                  borderBottomColor: "transparent",

                  ...focusStyle({
                    borderBottomColor: "$primary9",
                    zIndex: "2",
                  }),
                }}
                placeholder="Antwort"
                onBlur={onBlur}
                {...field}
              />
            )}
          </ControlledInput>
          <NodeLink target={edge?.target} />
          <Combobox.Root
            missingLabelPlaceholder="Ziel hat keinen Namen"
            name="target"
            onCreate={(name) => {
              // Construct the childNode
              const newInput = createInput();
              const childNode = createChildNode(nodeId, {
                data: {
                  inputs: [newInput.id],
                  name,
                  conditions: [],
                },
              });

              if (childNode instanceof Error) return childNode;

              if (edge?.target) {
                updateEdgeTarget(edge.id, childNode.id);
              } else {
                // Construct the Relationship
                const newCondition = createCondition({
                  inputId,
                  answerId: answer.id,
                });

                const newEdge = createEdge({
                  source: nodeId,
                  target: childNode.id,
                  conditionId: newCondition.id,
                });

                if (newEdge instanceof Error) {
                  addNotification({
                    title:
                      "Es konnte keine verbundender Knoten erstellt werden.",
                    content: newEdge.message,
                    variant: "danger",
                  });

                  return newEdge;
                }

                addCondition(newCondition);
                relateConditionToNode(nodeId, newCondition.id);
                addEdge(newEdge);
              }

              addInput(newInput);
              addNode(childNode);

              return { id: childNode.id, label: childNode.data.name };
            }}
            onSelectedItemChange={(newItem) => {
              if (!edge?.target && newItem) {
                const newCondition = createCondition({
                  inputId,
                  answerId: answer.id,
                });

                addCondition(newCondition);
                relateConditionToNode(nodeId, newCondition.id);

                createAndAddEdge({
                  source: nodeId,
                  target: newItem.id,
                  conditionId: newCondition.id,
                });
              }

              if (edge?.target && newItem)
                updateEdgeTarget(edge.id, newItem.id);
            }}
            items={allOptions}
            subsetOfItems={nodeOptions}
          >
            <Combobox.Input name="target">
              {({ css, ...field }) => (
                <Input
                  placeholder="Zielknoten auswählen"
                  css={{
                    borderRadius: 0,
                    borderBottomRightRadius: "$md",
                    marginLeft: "-1px",

                    ...focusStyle({
                      borderLeftColor: "$primary9",
                    }),
                    ...css,
                  }}
                  {...field}
                />
              )}
            </Combobox.Input>
          </Combobox.Root>
        </Box>
        <Box
          css={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <Button
            variant="neutral"
            type="button"
            square
            onPointerDown={(event) => controls.start(event)}
          >
            <Icon label="Verschiebe den Input">
              <DragHandle />
            </Icon>
          </Button>
          <Button
            variant="neutral"
            type="button"
            square
            onClick={() => deleteInputAnswer(inputId, answer.id)}
          >
            <Icon label="Entferne den Input">
              <TrashIcon />
            </Icon>
          </Button>
        </Box>
      </Form>
    </Reorder.Item>
  ) : (
    <Box>Kein Knoten ausgewählt</Box>
  );
}

type NodeLinkProps = { target?: string } & Omit<ButtonProps, "label" | "Icon">;

function NodeLink({ target, css, ...props }: NodeLinkProps) {
  const node = useNode(target ?? "");
  const { replaceSelectedNodes } = useTreeContext();

  return (
    <Button
      css={{
        boxShadow: "none",
        borderRadius: "0",
        borderBottomLeftRadius: "inherit",
        focusType: "inner",
        colorScheme: target ? "primary" : "gray",
        border: "1px solid $colors$gray7",
        width: "40px",
        ...css,
      }}
      pressable={false}
      size="small"
      variant="secondary"
      onClick={() => {
        if (target) {
          replaceSelectedNodes([target]);
        }
      }}
      type="button"
      disabled={!target}
      {...props}
    >
      <Icon
        label={
          node ? `Gehe zu Node: ${node.data.name}` : "Keine Node verbunden"
        }
      >
        <Crosshair2Icon />
      </Icon>
    </Button>
  );
}
