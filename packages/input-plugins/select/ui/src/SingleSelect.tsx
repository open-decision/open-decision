import {
  Box,
  Button,
  Icon,
  styled,
  Form,
  focusSelectorWithin,
  TargetSelector,
} from "@open-decision/design-system";
import * as React from "react";
import { Edge } from "@open-decision/type-classes";
import { DragHandle } from "./DragHandle";
import { Reorder, useDragControls } from "framer-motion";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { TSelectInput, TAnswer } from "@open-decision/select-input-plugin";
import {
  InputComponentProps,
  InputPrimaryActionSlotProps,
} from "@open-decision/input-plugin-helpers";

export const AddOptionButton = ({
  input,
  treeClient,
}: InputPrimaryActionSlotProps<TSelectInput>) => {
  return (
    <Button
      size="small"
      variant="secondary"
      onClick={() => {
        const newAnswer = treeClient.input.select.createAnswer({ text: "" });
        treeClient.input.select.addAnswer(input.id, newAnswer);
      }}
    >
      <Icon label="Neue Antwortmöglichkeit hinzufügen">
        <PlusIcon />
      </Icon>
      Hinzufügen
    </Button>
  );
};

const StyledReorderGroup = styled(Reorder.Group, {
  listStyle: "none",
  padding: 0,
  display: "grid",
  gap: "$4",
});

export const SingleSelect = ({
  nodeId,
  input,
  onClick,
  treeClient,
}: InputComponentProps<TSelectInput>) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  return (
    <StyledReorderGroup
      ref={ref}
      axis="y"
      values={input?.answers}
      onReorder={(newOrder) => {
        return treeClient.input.select.reorderAnswers(input)?.(newOrder);
      }}
    >
      {input.answers.map((answer) => {
        const edge = treeClient.condition.compare.getBy.answer(answer.id);

        return (
          <OptionTargetInput
            onClick={onClick}
            nodeId={nodeId}
            answer={answer}
            edge={edge}
            inputId={input.id}
            key={answer.id}
            groupRef={ref}
            input={input}
            treeClient={treeClient}
          />
        );
      })}
    </StyledReorderGroup>
  );
};

type SingleSelectInputProps = {
  answer: TAnswer;
  edge?: Edge.TEdge;
  nodeId: string;
  inputId: string;
  groupRef: React.MutableRefObject<HTMLDivElement | null>;
} & InputComponentProps<TSelectInput>;

export const OptionTargetInput = ({
  answer,
  edge,
  inputId,
  nodeId,
  groupRef,
  onClick,
  treeClient,
}: SingleSelectInputProps) => {
  const controls = useDragControls();
  const node = treeClient.nodes.get.single(nodeId);
  const nodeOptions = treeClient.nodes.get.options(nodeId);

  const ref = React.useRef<HTMLDivElement | null>(null);

  const formState = Form.useFormState({
    defaultValues: {
      answer: answer.text ?? "",
      target:
        nodeOptions.find((nodeOption) => nodeOption.id === edge?.target)
          ?.name ?? "",
    },
  });

  return (
    <Reorder.Item
      value={answer}
      dragListener={false}
      dragControls={controls}
      dragConstraints={groupRef}
    >
      <Form.Root
        state={formState}
        css={{
          flexDirection: "row",
          position: "relative",
          gap: "$1",
          groupColor: "$colorScheme-text",
        }}
      >
        <Box
          ref={ref}
          css={{
            flex: 1,
            borderRadius: "$md",
            layer: "2",
          }}
        >
          <Form.Input
            name={formState.names.answer}
            onChange={(event) =>
              treeClient.input.select.updateAnswer(
                inputId,
                answer.id,
                event.target.value
              )
            }
            placeholder="Antwort"
            css={{
              borderRadius: "0",
              borderTopLeftRadius: "inherit",
              borderTopRightRadius: "inherit",
              gridColumn: "1 / -1",
              marginBottom: "-1px",

              [`${focusSelectorWithin}`]: {
                zIndex: "$10",
              },
            }}
          />
          <TargetSelector
            nodeName={node?.data?.name}
            onClick={onClick}
            edge={edge}
            name={formState.names.target}
            value={formState.values.target}
            setValue={(newValue) =>
              formState.setValue(formState.names.target, newValue)
            }
            onCreate={(name) =>
              treeClient.input.select.createTargetNode(
                nodeId,
                inputId,
                answer.id,
                { name }
              )
            }
            onSelect={(newItem) =>
              treeClient.input.select.updateTarget({
                edgeId: edge?.id,
                nodeId,
                inputId,
                answerId: answer.id,
                newItem,
              })
            }
            nodeLinkCss={{ borderTopLeftRadius: 0 }}
            selectOptions={nodeOptions}
          />
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
            onClick={() =>
              treeClient.input.select.deleteAnswer(inputId, answer.id)
            }
          >
            <Icon label="Entferne den Input">
              <TrashIcon />
            </Icon>
          </Button>
        </Box>
      </Form.Root>
    </Reorder.Item>
  );
};
