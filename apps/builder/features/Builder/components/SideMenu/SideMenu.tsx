import { Stack, styled, StyleObject } from "@open-decision/design-system";
import { Separator } from "@open-decision/design-system";
import { ViewToggle } from "./ViewToggle";

const Container = styled(Stack, {
  paddingBlock: "$3",
  alignItems: "center",
  borderRight: "$border$layer",
  width: "56px",
});

type Props = {
  css?: StyleObject;
  selectedView: string;
  children?: React.ReactNode;
};

export function SideMenu({ css, selectedView, children }: Props) {
  return (
    <Container css={css}>
      <ViewToggle selectedView={selectedView} />
      <Separator css={{ width: "80%", marginTop: "$2" }} />
      {children}
    </Container>
  );
}
