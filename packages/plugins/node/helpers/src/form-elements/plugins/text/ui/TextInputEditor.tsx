import { Form, Separator, Stack } from "@open-decision/design-system";
import { TextInputPlugin } from "../textPlugin";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { InputComponentProps, InputConfig } from "../../../helpers";

const TextInput = new TextInputPlugin();

export const TextInputEditor = ({
  inputId,
  withRequiredOption,
}: InputComponentProps) => {
  const treeClient = useTreeClient();

  const input = useTree((treeClient) =>
    treeClient.pluginEntity.get.single<typeof TextInput.Type>("inputs", inputId)
  );

  const methods = Form.useForm({
    defaultValues: {
      required: [input.data.required ? "required" : ""],
      label: input?.label ?? "",
    },
  });

  if (!input) return null;

  return (
    <Stack>
      <Form.Root methods={methods}>
        <Separator className="my-2" />
        <InputConfig
          inputId={inputId}
          withRequiredOption={withRequiredOption}
          onLabelChange={(newValue) =>
            TextInput.updateLabel(inputId, newValue)(treeClient)
          }
          onRequiredChange={(newValue) =>
            TextInput.updateRequired(inputId, newValue)(treeClient)
          }
        />
      </Form.Root>
    </Stack>
  );
};
