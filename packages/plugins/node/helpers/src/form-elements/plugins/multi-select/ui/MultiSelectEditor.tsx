import * as React from "react";
import { Button, Form, Icon, Separator } from "@open-decision/design-system";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { AnimatePresence, Reorder, useDragControls } from "framer-motion";
import {
  TMultiSelectInput,
  MultiSelectInputPlugin,
} from "../multiSelectPlugin";
import { TrashIcon } from "@radix-ui/react-icons";
import {
  InputComponentProps,
  TAnswer,
  DragHandle,
  InputPrimaryActionSlotProps,
  AddOptionButton,
  InputConfig,
} from "../../../helpers";
import { ODProgrammerError } from "@open-decision/type-classes";

const MultiSelect = new MultiSelectInputPlugin();

export function MultiSelectInputConfigurator({
  inputId,
  withRequiredOption,
}: InputComponentProps) {
  const treeClient = useTreeClient();

  const ref = React.useRef<HTMLDivElement | null>(null);

  const input = useTree((treeClient) => {
    const input = treeClient.pluginEntity.get.single<TMultiSelectInput>(
      "inputs",
      inputId
    );
    if (input instanceof ODProgrammerError) return undefined;

    return input;
  });

  const methods = Form.useForm({
    defaultValues: {
      label: input?.label ?? "",
      required: [input?.data.required ? "required" : ""],
      ...Object.fromEntries(
        input?.data.answers.map((answer) => [answer.id, answer.value]) ?? []
      ),
    },
  });

  if (!input) return null;

  return (
    <Reorder.Group
      className="list-none p-0 grid"
      ref={ref}
      axis="y"
      values={input.data.answers ?? []}
      onReorder={(newOrder) => {
        return MultiSelect.reorderAnswers(input.id, newOrder)(treeClient);
      }}
    >
      <Form.Root methods={methods}>
        {input.data.answers.map((answer) => {
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
}

type AnswerProps = {
  answer: TAnswer;
  inputId: string;
  groupRef: React.MutableRefObject<HTMLDivElement | null>;
  name: string;
};

const Answer = ({ answer, inputId, groupRef, name }: AnswerProps) => {
  const treeClient = useTreeClient();

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      MultiSelect.updateAnswer(
        inputId,
        answer.id,
        event.target.value
      )(treeClient),
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

export function MultiSelectInputPrimaryActionSlot({
  inputId,
}: InputPrimaryActionSlotProps) {
  const treeClient = useTreeClient();

  return (
    <AddOptionButton
      onClick={() => {
        const newAnswer = MultiSelect.createAnswer({ value: "" });
        MultiSelect.addAnswer(inputId, newAnswer)(treeClient);
      }}
    />
  );
}
