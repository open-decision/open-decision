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
        htmlFor="projectName"
        size="medium"
        css={{ color: "inherit", fontWeight: 600 }}
      >
        Projekt {">"}
      </Label>
      <Form
        onChange={({ values }) =>
          send({
            type: "updateTree",
            tree: {
              treeName: values.projectName,
            },
          })
        }
        initialValues={{ projectName: treeName ?? "" }}
      >
        <InlineInput
          css={{ color: "inherit" }}
          name="projectName"
          id="projectName"
        />
      </Form>
    </Container>
  );
}
