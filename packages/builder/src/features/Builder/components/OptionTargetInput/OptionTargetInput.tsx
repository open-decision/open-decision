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
} from "@open-decision/design-system";
import * as React from "react";
import { Edge, Input as InputType } from "@open-decision/type-classes";
import { pipe, values } from "remeda";
import { Plus, Trash, Crosshair } from "react-feather";
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
import { useEditor } from "features/Builder/state/useEditor";

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
  const {
    addInputAnswer,
    createAnswer,
    createAndAddCondition,
    updateInputAnswerOrder,
  } = useTreeContext();
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
            <Plus />
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

              return condition.answer === answer.id;
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
  } = useTreeContext();
  const { addNotification } = useNotificationStore();

  const allOptions = pipe(
    nodes,
    values,
    map((node) => ({ id: node.id, label: node.data.name }))
  );

  const nodeOptions = node
    ? pipe(
        getConnectableNodes(node.id),
        map((nodeId) => ({
          id: nodeId,
          label: nodes[nodeId].data.name,
        }))
      )
    : [];

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

                  ...focusStyle({
                    zIndex: "$10",
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

              // Construct the Relationship
              const newCondition = createCondition({
                inputId,
                answer: answer.id,
              });

              const newEdge = createEdge({
                source: nodeId,
                target: childNode.id,
                conditionId: newCondition.id,
              });

              if (newEdge instanceof Error) {
                addNotification({
                  title: "Es konnte keine verbundender Knoten erstellt werden.",
                  content: newEdge.message,
                  variant: "danger",
                });

                return newEdge;
              }

              addCondition(newCondition);
              relateConditionToNode(nodeId, newCondition.id);
              addInput(newInput);
              addNode(childNode);
              addEdge(newEdge);

              return { id: childNode.id, label: childNode.data.name };
            }}
            onSelectedItemChange={(newItem) => {
              if (!edge?.target && newItem) {
                const newCondition = createCondition({
                  inputId,
                  answer: answer.id,
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
              {(field) => (
                <Input
                  placeholder="Zielknoten auswählen"
                  css={{
                    borderRadius: 0,
                    borderBottomRightRadius: "$md",
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
              <Trash />
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

function NodeLink({ target, ...props }: NodeLinkProps) {
  const node = useNode(target ?? "");
  const { addSelectedNodes } = useEditor();

  return (
    <Button
      css={{
        boxShadow: "none",
        borderRadius: "0",
        borderBottomLeftRadius: "inherit",
        focusType: "inner",
        maxWidth: "100%",
        colorScheme: target ? "primary" : "gray",
        border: "1px solid",
      }}
      pressable={false}
      size="small"
      variant="secondary"
      onClick={() => {
        if (target) {
          addSelectedNodes([target]);
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
        <Crosshair />
      </Icon>
    </Button>
  );
}
