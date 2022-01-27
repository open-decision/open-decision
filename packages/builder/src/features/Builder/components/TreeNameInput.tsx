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
  const [treeName, send] = useTree((state) => state.treeName);
  const [Form] = useForm({ defaultValues: { treeName } });

  return (
    <Container css={css}>
      <ProjectMenu css={{ marginRight: "10px" }} />
      <Form
        onSubmit={({ treeName }) =>
          send({
            type: "updateTree",
            tree: { treeName },
          })
        }
      >
        <ControlledInput
          name="treeName"
          onChange={(event) =>
            send({
              type: "updateTree",
              tree: { treeName: event.target.value },
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
