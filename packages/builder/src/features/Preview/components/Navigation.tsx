import {
  Icon,
  Button,
  styled,
  hoverStyle,
  Row,
  ButtonProps,
} from "@open-decision/design-system";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

const Container = styled(Row, {
  layer: "1",
  padding: "$2",
  boxShadow: "$1",
  maxWidth: "max-content",
  gap: "$2",
  borderRadius: "$md",
});

const StyledButton = styled(Button, {
  ...hoverStyle({
    backgroundColor: "$gray3",
  }),
});

const buttonProps: ButtonProps = {
  variant: "neutral",
  size: "large",
  css: { colorScheme: "primary" },
};

export function Navigation() {
  return (
    <Container>
      <StyledButton {...buttonProps}>
        <Icon label="Zurück zum Start">
          <DoubleArrowLeftIcon />
        </Icon>
      </StyledButton>
      <StyledButton {...buttonProps}>
        <Icon label="Zurück">
          <ChevronLeftIcon />
        </Icon>
      </StyledButton>
      <StyledButton {...buttonProps}>
        <Icon label="Weiter">
          <ChevronRightIcon />
        </Icon>
      </StyledButton>
      <StyledButton {...buttonProps}>
        <Icon label="Zum letzten Knoten">
          <DoubleArrowRightIcon />
        </Icon>
      </StyledButton>
    </Container>
  );
}
