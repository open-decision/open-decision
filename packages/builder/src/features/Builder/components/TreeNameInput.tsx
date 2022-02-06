import {
  Box,
  styled,
  StyleObject,
  useForm,
  ControlledInput,
  Input,
} from "@open-legal-tech/design-system";
import { useTree } from "features/Builder/state/useTree";
import * as React from "react";
import { ProjectMenu } from "./ProjectMenu";

const Container = styled(Box, {
  display: "flex",
  alignItems: "center",
});

type Props = { css?: StyleObject };

export function TreeNameInput({ css }: Props) {
  const [name, send] = useTree((state) => state.name);
  const [Form] = useForm({ defaultValues: { name } });

  return (
    <Container css={css}>
      <ProjectMenu css={{ marginRight: "10px" }} />
      <Form
        onSubmit={({ name }) =>
          send({
            type: "updateTree",
            tree: { name },
          })
        }
      >
        <ControlledInput
          name="name"
          onChange={(event) =>
            send({
              type: "updateTree",
              tree: { name: event.target.value },
            })
          }
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
