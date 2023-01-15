import { Form } from "@open-decision/design-system";
import { useInterpreterTree } from "@open-decision/interpreter-react";
import { ODProgrammerError } from "@open-decision/type-classes";
import { RendererComponentProps } from "../../../helpers";
import { TTextInput } from "../textPlugin";

export function TextInputRenderer({ inputId }: RendererComponentProps) {
  const input = useInterpreterTree((treeClient) => {
    const input = treeClient.pluginEntity.get.single<TTextInput>(
      "inputs",
      inputId
    );

    if (input instanceof ODProgrammerError) return undefined;
    return input;
  });

  const { register } = Form.useFormContext();

  if (!input) return null;

  return (
    <Form.Field Label={input.label ?? "Eingabe"} required={input.data.required}>
      <Form.Input
        {...register(inputId, { required: input.data.required })}
        autoComplete="off"
        className="bg-layer-1"
      />
    </Form.Field>
  );
}
