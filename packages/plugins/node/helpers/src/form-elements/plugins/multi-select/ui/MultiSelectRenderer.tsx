import { Form, Stack } from "@open-decision/design-system";
import { useInterpreterTree } from "@open-decision/interpreter-react";
import { CheckboxElement } from "../../../helpers";
import { InputRenderer } from "../../../helpers/types";
import { IMultiSelectInput } from "../MultiSelectPlugin";

export const MultiSelectInputRenderer: InputRenderer = ({ inputId }) => {
  const input = useInterpreterTree((treeClient) => {
    return treeClient.pluginEntity.get.single<IMultiSelectInput>(
      "inputs",
      inputId
    );
  });

  const { register } = Form.useFormContext();

  if (!input) return null;

  return (
    <Form.Field
      Label={input.label ?? "Mehrfacheingabe"}
      name={inputId}
      required={input.required}
    >
      <Stack className="gap-2">
        {input.answers.map((answer) => {
          return (
            <CheckboxElement
              {...register(inputId)}
              value={answer.id}
              answer={answer}
              key={answer.id}
            />
          );
        })}
      </Stack>
    </Form.Field>
  );
};
