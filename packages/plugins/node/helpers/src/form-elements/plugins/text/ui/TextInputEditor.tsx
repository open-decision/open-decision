import { Form } from "@open-decision/design-system";
import { TextInputPlugin } from "../textPlugin";
import { useTree } from "@open-decision/tree-sync";
import { InputComponentProps, InputConfig } from "../../../helpers";

const TextInput = new TextInputPlugin();

export const TextInputEditor = ({ inputId }: InputComponentProps) => {
  const input = useTree((treeClient) =>
    treeClient.pluginEntity.get.single<typeof TextInput.Type>("inputs", inputId)
  );

  const methods = Form.useForm({
    defaultValues: {
      label: input?.label ?? "",
    },
  });

  if (!input) return null;

  return (
    <Form.Root methods={methods} className="gap-0">
      <InputConfig inputId={input.id} />
    </Form.Root>
  );
};
