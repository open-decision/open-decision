import {
  Icon,
  Button,
  styled,
  Row,
  ButtonProps,
  StyleObject,
} from "@open-decision/design-system";
import { useInterpreter } from "@open-decision/interpreter-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

const Container = styled(Row, {
  layer: "1",
  padding: "$2",
  boxShadow: "$3",
  maxWidth: "max-content",
  gap: "$2",
  borderRadius: "$md",
});

const StyledButton = styled(Button, {});

const buttonProps: ButtonProps = {
  variant: "neutral",
  size: { "@desktop": "large" },
  css: { colorScheme: "primary" },
};

type Props = { css?: StyleObject };

export function Navigation({ css }: Props) {
  const { send, canGoBack, canGoForward } = useInterpreter();

  return (
    <Container css={css}>
      <StyledButton
        {...buttonProps}
        onClick={() => send("GO_BACK")}
        disabled={!canGoBack}
      >
        <Icon label="Zurück">
          <ChevronLeftIcon />
        </Icon>
      </StyledButton>
      <StyledButton
        {...buttonProps}
        disabled={!canGoForward}
        onClick={() => send("GO_FORWARD")}
      >
        <Icon label="Vorwärts">
          <ChevronRightIcon />
        </Icon>
      </StyledButton>
    </Container>
  );
}
