import {
  Box,
  styled,
  StyleObject,
  useForm,
  ControlledInput,
  Input,
} from "@open-decision/design-system";
import * as React from "react";
import { ProjectMenu } from "./ProjectMenu";
import { useTreeData } from "../state/treeStore/hooks";
import { useTree } from "../state/treeStore/TreeProvider";

const Container = styled(Box, {
  display: "flex",
  alignItems: "center",
});

type Props = { css?: StyleObject };

export function TreeNameInput({ css }: Props) {
  const { updateTreeName } = useTree();
  const { name } = useTreeData();
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
