import {
  Box,
  Form,
  InlineInput,
  Label,
  styled,
  StyleObject,
} from "@open-legal-tech/design-system";
import { useTree } from "features/Builder/state/useTree";
import * as React from "react";

const Container = styled(Box, {
  display: "flex",
  alignItems: "center",
});

type Props = { css?: StyleObject };

export function TreeNameInput({ css }: Props) {
  const [treeName, send] = useTree((state) => state.treeName);

  return (
    <Container css={css}>
      <Label
        htmlFor="treeName"
        size="medium"
        css={{ color: "inherit", fontWeight: 600 }}
      >
        Projekt {">"}
      </Label>
      <Form
        onSubmit={({ treeName }) =>
          send({
            type: "updateTree",
            tree: { treeName },
          })
        }
        defaultValues={{ treeName }}
      >
        <InlineInput css={{ color: "inherit" }} name="treeName" id="treeName" />
      </Form>
    </Container>
  );
}
