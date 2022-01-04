import {
  Box,
  Form,
  InlineInput,
  Label,
  styled,
  StyleObject,
  Link as SystemLink,
  Icon,
} from "@open-legal-tech/design-system";
import { useTree } from "features/Builder/state/useTree";
import Link from "next/link";
import * as React from "react";
import { ChevronLeft } from "react-feather";

const Container = styled(Box, {
  display: "flex",
  alignItems: "center",
});

type Props = { css?: StyleObject };

export function TreeNameInput({ css }: Props) {
  const [treeName, send] = useTree((state) => state.treeName);

  return (
    <Container css={css}>
      {/* FIXME this Link should go to the Dashboard when it exists */}
      <Link passHref href="/">
        <SystemLink
          css={{
            color: "$gray11",
            fontWeight: "$extra-small-heading",
            padding: "var(--padding)",
            maxWidth: "max-content",
            marginBottom: "-1px",
          }}
        >
          <Label
            htmlFor="treeName"
            size="medium"
            css={{
              color: "inherit",
              fontWeight: 600,
              display: "flex",
              gap: "$1",
            }}
          >
            <Icon label="Zurück">
              <ChevronLeft />
            </Icon>
            Projekt:
          </Label>
        </SystemLink>
      </Link>
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
