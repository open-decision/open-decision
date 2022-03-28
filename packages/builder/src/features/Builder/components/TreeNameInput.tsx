import {
  StyleObject,
  useForm,
  ControlledInput,
  Input,
  Text,
  Popover,
  Field,
} from "@open-decision/design-system";
import * as React from "react";
import { useTreeData } from "../state/treeStore/hooks";
import { useTreeContext } from "../state/treeStore/TreeContext";

type Props = { css?: StyleObject };

export function TreeNameInput({ css }: Props) {
  const { updateTreeName } = useTreeContext();
  const { name } = useTreeData();
  const [Form] = useForm({ defaultValues: { name: name ?? "" } });

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Text css={{ fontWeight: "500", flex: 1, ...css }}>
          {name && name?.length > 1 ? name : "Kein Name"}
        </Text>
      </Popover.Trigger>
      <Popover.Content align="start" sideOffset={10}>
        <Form onSubmit={({ name }) => updateTreeName(name)}>
          <Field label="Projektnamen ändern">
            <ControlledInput
              name="name"
              onChange={(event) => updateTreeName(event.target.value)}
            >
              {(field) => (
                <Input
                  {...field}
                  css={{ color: "$white", width: "300px" }}
                  id="treeName"
                />
              )}
            </ControlledInput>
          </Field>
        </Form>
      </Popover.Content>
    </Popover.Root>
  );
}
