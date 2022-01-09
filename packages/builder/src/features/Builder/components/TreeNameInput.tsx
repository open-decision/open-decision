import {
  Box,
  InlineInput,
  Label,
  styled,
  StyleObject,
  Link as SystemLink,
  Icon,
  useForm,
  ControlledInput,
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
  const [Form] = useForm({ defaultValues: { treeName } });

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
          underline={false}
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
            <InlineInput {...field} css={{ color: "inherit" }} id="treeName" />
          )}
        </ControlledInput>
      </Form>
    </Container>
  );
}
