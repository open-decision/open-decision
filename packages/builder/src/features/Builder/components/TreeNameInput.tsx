import {
  StyleObject,
  useForm,
  ControlledInput,
  Input,
  Text,
  Popover,
  Field,
} from "@open-decision/design-system";
import {
  useGetTreeNameQuery,
  useUpdateTreeMutation,
} from "features/Data/generated/graphql";
import { queryClient } from "features/Data/queryClient";
import { useTreeId } from "features/Data/useTreeId";
import * as React from "react";

type Props = { css?: StyleObject };

export function TreeNameInput({ css }: Props) {
  const id = useTreeId();

  const { data } = useGetTreeNameQuery({ id: Number(id) });
  const { mutate: updateTreeName } = useUpdateTreeMutation({
    onSuccess: () => queryClient.invalidateQueries("getTreeName"),
  });
  const name = data?.decisionTree?.name;
  const [Form] = useForm({ defaultValues: { name: name ?? "" } });

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Text css={{ fontWeight: "500", flex: 1, ...css }}>
          {name && name?.length > 0 ? name : "Kein Name"}
        </Text>
      </Popover.Trigger>
      <Popover.Content align="start" sideOffset={10}>
        <Form
          onSubmit={({ name }) => {
            updateTreeName({ data: { name: { set: name } }, id: Number(id) });
          }}
        >
          <Field label="Projektnamen ändern">
            <ControlledInput
              name="name"
              onChange={(event) => {
                updateTreeName({
                  data: { name: { set: event.target.value } },
                  id: Number(id),
                });
              }}
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
