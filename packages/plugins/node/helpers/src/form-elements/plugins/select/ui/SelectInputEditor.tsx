import { Button, Icon, Form, Separator } from "@open-decision/design-system";
import * as React from "react";
import { AnimatePresence, Reorder, useDragControls } from "framer-motion";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { SelectInputPlugin } from "../selectPlugin";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import {
  InputPrimaryActionSlotProps,
  AddOptionButton,
  InputComponentProps,
  InputConfig,
  TAnswer,
  DragHandle,
} from "../../../helpers";

const SelectInput = new SelectInputPlugin();

export const SelectInputPrimaryActionSlot = ({
  inputId,
}: InputPrimaryActionSlotProps) => {
  const treeClient = useTreeClient();

  return (
    <AddOptionButton
      onClick={() => {
        const newAnswer = SelectInput.createAnswer({ value: "" });
        SelectInput.addAnswer(inputId, newAnswer)(treeClient);
      }}
    />
  );
};

export const SelectInputConfigurator = ({ inputId }: InputComponentProps) => {
  const treeClient = useTreeClient();
  const ref = React.useRef<HTMLDivElement | null>(null);

  const input = useTree((treeClient) =>
    treeClient.pluginEntity.get.single<typeof SelectInput.Type>(
      "inputs",
      inputId
    )
  );

  const methods = Form.useForm({
    defaultValues: {
      label: input?.label ?? "",
      required: input?.required.toString() ?? "false",
      ...Object.fromEntries(
        input.data.answers.map((answer) => [answer.id, answer.value])
      ),
    },
  });

  if (!input) return null;

  return (
    <Reorder.Group
      className="list-none p-0 grid gap-4"
      ref={ref}
      axis="y"
      values={input.data.answers ?? []}
      onReorder={(newOrder) => {
        SelectInput.reorderAnswers(input.id, newOrder)(treeClient);
      }}
    >
      <Form.Root methods={methods} className="gap-2">
        {input.data.answers?.map((answer) => {
          return (
            <Answer
              answer={answer}
              inputId={inputId}
              groupRef={ref}
              key={answer.id}
              name={answer.id}
            />
          );
        })}
        <Separator />
        <InputConfig inputId={inputId} />
      </Form.Root>
    </Reorder.Group>
  );
};

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
      SelectInput.updateAnswer(
        inputId,
        answer.id,
        event.target.value
      )(treeClient),
    [answer.id, inputId, treeClient]
  );

  const onClick = React.useCallback(
    () => SelectInput.deleteAnswer(inputId, answer.id)(treeClient),
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
        <div className="grid gap-1 grid-cols-[1fr_max-content_max-content] items-center">
          <Form.Input
            key={answer.id}
            placeholder="Antwort"
            {...register(name, { onChange })}
          />
          <Button
            variant="neutral"
            size="small"
            square
            onPointerDown={(event) => controls.start(event)}
          >
            <Icon label="Verschiebe den Input">
              <DragHandle />
            </Icon>
          </Button>
          <Button variant="neutral" size="small" square onClick={onClick}>
            <Icon label="Entferne den Input">
              <CrossCircledIcon />
            </Icon>
          </Button>
        </div>
      </Reorder.Item>
    </AnimatePresence>
  );
};
