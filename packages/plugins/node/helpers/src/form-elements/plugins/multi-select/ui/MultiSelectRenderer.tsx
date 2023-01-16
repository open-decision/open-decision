import { IMultiSelectInput } from "../MultiSelectPlugin";

import { Form, Stack } from "@open-decision/design-system";
import { useInterpreterTree } from "@open-decision/interpreter-react";
import { CheckboxElement } from "../../../helpers";
import { ODProgrammerError } from "@open-decision/type-classes";
import { InputRenderer } from "../../../helpers/types";

export const MultiSelectInputRenderer: InputRenderer = ({ inputId }) => {
  const input = useInterpreterTree((treeClient) => {
    const input = treeClient.pluginEntity.get.single<IMultiSelectInput>(
      "inputs",
      inputId
    );

    if (input instanceof ODProgrammerError) return undefined;
    return input;
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
