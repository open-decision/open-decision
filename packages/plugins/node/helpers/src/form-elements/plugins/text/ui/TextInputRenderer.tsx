import { Form } from "@open-decision/design-system";
import { useInterpreterTree } from "@open-decision/interpreter-react";
import { RendererComponentProps } from "../../../helpers";
import { TextInputPlugin } from "../textPlugin";

const TextInput = new TextInputPlugin();

export function TextInputRenderer({ inputId }: RendererComponentProps) {
  const input = useInterpreterTree((treeClient) => {
    return treeClient.pluginEntity.get.single<typeof TextInput.Type>(
      "inputs",
      inputId
    );
  });

  const { register } = Form.useFormContext();

  return (
    <Form.Field Label={input.label ?? "Eingabe"} required={input.data.required}>
      <Form.Input
        {...register(inputId, { required: input.data.required })}
        autoComplete="off"
      />
    </Form.Field>
  );
}
