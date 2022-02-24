import {
  Box,
  styled,
  StyleObject,
  useForm,
  ControlledInput,
  Input,
} from "@open-legal-tech/design-system";
import { updateTreeName } from "features/Builder/state/treeStore/treeStore";
import * as React from "react";
import { ProjectMenu } from "./ProjectMenu";
import { useTree } from "../state/treeStore/hooks";

const Container = styled(Box, {
  display: "flex",
  alignItems: "center",
});

type Props = { css?: StyleObject };

export function TreeNameInput({ css }: Props) {
  const { name } = useTree();
  const [Form] = useForm({ defaultValues: { name: name ?? "" } });

  return (
    <Container css={css}>
      <ProjectMenu css={{ marginRight: "10px" }} />
      <Form onSubmit={({ name }) => updateTreeName(name)}>
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
      </Form>
    </Container>
  );
}
