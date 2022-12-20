import { SelectInputPlugin } from "../singleSelectPlugin";
import { RendererRadioGroup } from "@open-decision/plugins-node-helpers";
import { RendererComponentProps } from "../../../types/inputTypes";
import { Form, Stack } from "@open-decision/design-system";
import { useInterpreterTree } from "@open-decision/interpreter-react";

const Select = new SelectInputPlugin();

export function SingleSelectInputRenderer({ inputId }: RendererComponentProps) {
  const input = useInterpreterTree((treeClient) => {
    return treeClient.pluginEntity.get.single<typeof Select.Type>(
      "inputs",
      inputId
    );
  });

  const { watch } = Form.useFormContext();

  return (
    <Form.Field
      required={input.required}
      Label={input.label ?? "Einfachauswahl"}
      name={inputId}
    >
      <Stack className="gap-2">
        <RendererRadioGroup
          required={input.required}
          name={input.id}
          answers={input.data.answers}
          key={inputId}
          activeValue={watch(input.id)}
        />
      </Stack>
    </Form.Field>
  );
}
