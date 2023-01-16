import { Form, Stack } from "@open-decision/design-system";
import { useInterpreterTree } from "@open-decision/interpreter-react";
import { ISelectInput } from "../SelectInputPlugin";
import { RendererComponentProps, RendererRadioGroup } from "../../../helpers";
import { ODProgrammerError } from "@open-decision/type-classes";

export function SelectInputRendererComponent({
  inputId,
  className,
}: RendererComponentProps) {
  const input = useInterpreterTree((treeClient) => {
    const input = treeClient.pluginEntity.get.single<ISelectInput>(
      "inputs",
      inputId
    );

    if (input instanceof ODProgrammerError) return undefined;
    return input;
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
}
