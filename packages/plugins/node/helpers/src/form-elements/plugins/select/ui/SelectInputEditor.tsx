import { Button, Icon, Form, Separator } from "@open-decision/design-system";
import * as React from "react";
import { AnimatePresence, Reorder, useDragControls } from "framer-motion";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { ISelectInput, SelectInputPlugin } from "../SelectInputPlugin";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import {
  InputPrimaryActionSlotProps,
  AddOptionButton,
  InputComponentProps,
  TAnswer,
  DragHandle,
  InputConfig,
} from "../../../helpers";
import { ODProgrammerError } from "@open-decision/type-classes";

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

export const SelectInputConfigurator = ({
  inputId,
  withRequiredOption,
}: InputComponentProps) => {
  const treeClient = useTreeClient();
  const ref = React.useRef<HTMLDivElement | null>(null);

  const input = useTree((treeClient) => {
    const input = treeClient.pluginEntity.get.single<ISelectInput>(
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
        SelectInput.reorderAnswers(input.id, newOrder)(treeClient);
      }}
    >
      <Form.Root methods={methods}>
        {input.answers?.map((answer, index) => {
          return (
            <Answer
              answer={answer}
              inputId={inputId}
              groupRef={ref}
              key={answer.id}
              name={answer.id}
              index={index}
            />
          );
        })}
        <Separator className="my-2" />
        <InputConfig
          inputId={inputId}
          withRequiredOption={withRequiredOption}
          onLabelChange={(newLabel) =>
            SelectInput.updateLabel(inputId, newLabel)(treeClient)
          }
          onRequiredChange={(newValue) =>
            SelectInput.updateRequired(inputId, newValue)(treeClient)
          }
        />
      </Form.Root>
    </Reorder.Group>
  );
};

type AnswerProps = {
  answer: TAnswer;
  inputId: string;
  groupRef: React.MutableRefObject<HTMLDivElement | null>;
  name: string;
  index: number;
};

const Answer = ({ answer, inputId, groupRef, name, index }: AnswerProps) => {
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
            aria-label={`Antwortoption ${index + 1}`}
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
