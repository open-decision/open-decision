import { Form, Stack } from "@open-decision/design-system";
import { useInterpreterTree } from "@open-decision/interpreter-react";
import { ISelectInput } from "../SelectInputPlugin";
import { RendererRadioGroup } from "../../../helpers";
import { InputRenderer } from "../../../helpers/types";

export const SelectInputRendererComponent: InputRenderer = ({
  inputId,
  className,
}) => {
  const input = useInterpreterTree((treeClient) => {
    return treeClient.pluginEntity.get.single<ISelectInput>("inputs", inputId);
  });

  const { watch } = Form.useFormContext();
  if (!input) return null;

  return (
    <Form.Field
      Label={input.label ?? "Einfachauswahl"}
      name={inputId}
      required
      className={className}
    >
      <Stack className="gap-2">
        <RendererRadioGroup
          required
          name={input.id}
          answers={input.answers}
          key={inputId}
          activeValue={watch(inputId)}
        />
      </Stack>
    </Form.Field>
  );
};
