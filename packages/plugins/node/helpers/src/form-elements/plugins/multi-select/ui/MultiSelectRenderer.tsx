import { IMultiSelectInput } from "../multiSelectPlugin";

import { Form, Stack } from "@open-decision/design-system";
import { useInterpreterTree } from "@open-decision/interpreter-react";
import { RendererComponentProps, CheckboxElement } from "../../../helpers";
import { ODProgrammerError } from "@open-decision/type-classes";

export function MultiSelectInputRenderer({ inputId }: RendererComponentProps) {
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
      required={input.data.required}
    >
      <Stack className="gap-2">
        {input.data.answers.map((answer) => {
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
}
