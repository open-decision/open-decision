import { MultiSelectInputPlugin } from "../multiSelectPlugin";

import { Form, Stack } from "@open-decision/design-system";
import { useInterpreterTree } from "@open-decision/interpreter-react";
import { RendererComponentProps, CheckboxElement } from "../../../helpers";

const MultiSelect = new MultiSelectInputPlugin();

export function MultiSelectInputRenderer({ inputId }: RendererComponentProps) {
  const input = useInterpreterTree((treeClient) => {
    return treeClient.pluginEntity.get.single<typeof MultiSelect.Type>(
      "inputs",
      inputId
    );
  });

  const { register } = Form.useFormContext();

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
