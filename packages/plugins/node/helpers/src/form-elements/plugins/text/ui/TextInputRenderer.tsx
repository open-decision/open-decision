import { Form } from "@open-decision/design-system";
import { useInterpreterTree } from "@open-decision/interpreter-react";
import { ODProgrammerError } from "@open-decision/type-classes";
import { InputRenderer } from "../../../helpers/types";
import { ITextInput } from "../TextInputPlugin";

export const TextInputRenderer: InputRenderer = ({ inputId }) => {
  const input = useInterpreterTree((treeClient) => {
    const input = treeClient.pluginEntity.get.single<ITextInput>(
      "inputs",
      inputId
    );

    if (input instanceof ODProgrammerError) return undefined;
    return input;
  });

  const { register } = Form.useFormContext();

  if (!input) return null;

  return (
    <Form.Field Label={input.label ?? "Eingabe"} required={input.required}>
      <Form.Input
        {...register(inputId, { required: input.required })}
        autoComplete="off"
        className="bg-layer-1"
      />
    </Form.Field>
  );
};
