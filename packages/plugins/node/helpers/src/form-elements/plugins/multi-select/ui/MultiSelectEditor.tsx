import * as React from "react";
import { Button, Form, Icon, Separator } from "@open-decision/design-system";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { AnimatePresence, Reorder, useDragControls } from "framer-motion";
import {
  IMultiSelectInput,
  MultiSelectInputPlugin,
} from "../MultiSelectPlugin";
import { TrashIcon } from "@radix-ui/react-icons";
import {
  DragHandle,
  AddOptionButton,
  InputConfig,
  TInputId,
} from "../../../helpers";
import { ODProgrammerError } from "@open-decision/type-classes";
import {
  InputConfigurator,
  InputPrimaryActionSlot,
  TAnswer,
} from "../../../helpers/types";
import { isNodeId } from "@open-decision/tree-type";

const MultiSelect = new MultiSelectInputPlugin();

export const MultiSelectInputConfigurator: InputConfigurator = ({
  inputId,
  withRequiredOption,
}) => {
  const treeClient = useTreeClient();

  const ref = React.useRef<HTMLDivElement | null>(null);

  const input = useTree((treeClient) => {
    const input = treeClient.pluginEntity.get.single<IMultiSelectInput>(
      "inputs",
      inputId
    );
    if (input instanceof ODProgrammerError) return undefined;

    return input;
  });

  const methods = Form.useForm({
    defaultValues: {
      label: input?.label ?? "",
      required: [input?.required ? "required" : ""],
      ...Object.fromEntries(
        input?.answers.map((answer) => [answer.id, answer.value]) ?? []
      ),
    },
  });

  if (!input) return null;

  return (
    <Reorder.Group
      className="list-none p-0 grid"
      ref={ref}
      axis="y"
      values={input.answers ?? []}
      onReorder={(newOrder) => {
        return MultiSelect.reorderAnswers(input.id, newOrder)(treeClient);
      }}
    >
      <Form.Root methods={methods}>
        {input.answers.map((answer) => {
          return (
            <Answer
              groupRef={ref}
              answer={answer}
              inputId={input.id}
              key={answer.id}
              name={answer.id}
            />
          );
        })}
        <Separator className="my-2" />
        <InputConfig
          inputId={inputId}
          withRequiredOption={withRequiredOption}
          onLabelChange={(newValue) =>
            MultiSelect.updateLabel(inputId, newValue)(treeClient)
          }
          onRequiredChange={(newValue) =>
            MultiSelect.updateRequired(inputId, newValue)(treeClient)
          }
        />
      </Form.Root>
    </Reorder.Group>
  );
};

type AnswerProps = {
  answer: TAnswer;
  inputId: TInputId;
  groupRef: React.MutableRefObject<HTMLDivElement | null>;
  name: string;
};

const Answer = ({ answer, inputId, groupRef, name }: AnswerProps) => {
  const treeClient = useTreeClient();

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isNodeId(event.target.value)) return;
      return MultiSelect.updateAnswer(
        inputId,
        answer.id,
        event.target.value
      )(treeClient);
    },
    [answer.id, inputId, treeClient]
  );

  const onClick = React.useCallback(
    () => MultiSelect.deleteAnswer(inputId, answer.id)(treeClient),
    [answer.id, inputId, treeClient]
  );

  const controls = useDragControls();
  const { register } = Form.useFormContext();

  return (
    <AnimatePresence initial={false}>
      <Reorder.Item
        key={answer.id}
        value={answer}
        dragListener={false}
        dragControls={controls}
        dragConstraints={groupRef}
      >
        <div className="grid gap-2 grid-cols-[1fr_max-content_max-content] items-center">
          <Form.Input
            key={answer.id}
            placeholder="Antwort"
            {...register(name, { onChange })}
          />
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
          <Button variant="neutral" type="button" square onClick={onClick}>
            <Icon label="Entferne den Input">
              <TrashIcon />
            </Icon>
          </Button>
        </div>
      </Reorder.Item>
    </AnimatePresence>
  );
};

export const MultiSelectInputPrimaryActionSlot: InputPrimaryActionSlot = ({
  inputId,
}) => {
  const treeClient = useTreeClient();

  return (
    <AddOptionButton
      onClick={() => {
        const newAnswer = MultiSelect.createAnswer({});
        MultiSelect.addAnswer(inputId, newAnswer)(treeClient);
      }}
    />
  );
};
