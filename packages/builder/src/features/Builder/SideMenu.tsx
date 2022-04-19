import { Stack, styled, StyleObject } from "@open-decision/design-system";
import { Separator } from "components/Separator";
import { CreateNodeButton } from "./CreateNodeButton";

const Container = styled(Stack, {
  padding: "$2",
  alignItems: "center",
  boxShadow: "$1",
  zIndex: "$10",
});

type Props = { css?: StyleObject };

export function SideMenu({ css }: Props) {
  return (
    <Container css={css}>
      <CreateNodeButton css={{ marginBottom: "$2" }} />
      <Separator css={{ width: "80%" }} />
    </Container>
  );
}
