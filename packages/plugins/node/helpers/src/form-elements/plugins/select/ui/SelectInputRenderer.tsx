import { Form, Stack } from "@open-decision/design-system";
import { useInterpreterTree } from "@open-decision/interpreter-react";
import { SelectInputPlugin } from "../selectPlugin";
import { RendererComponentProps, RendererRadioGroup } from "../../../helpers";

const SelectInput = new SelectInputPlugin();

export function SelectInputRendererComponent({
  inputId,
  className,
}: RendererComponentProps) {
  const input = useInterpreterTree((treeClient) => {
    return treeClient.pluginEntity.get.single<typeof SelectInput.Type>(
      "inputs",
      inputId
    );
  });

  const { watch } = Form.useFormContext();

  return (
    <Form.Field
      Label={input.data.label ?? "Einfachauswahl"}
      name={inputId}
      required
      className={className}
    >
      <Stack className="gap-2">
        <RendererRadioGroup
          required
          name="answer"
          answers={input.data.answers}
          key={inputId}
          activeValue={watch(inputId)}
        />
      </Stack>
    </Form.Field>
  );
}
