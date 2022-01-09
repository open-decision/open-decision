import {
  Box,
  useWatch,
  Icon,
  Button,
  styled,
} from "@open-legal-tech/design-system";
import { ArrowLeft, ArrowRight } from "react-feather";
import { Interpreter } from "@open-decision/interpreter";
import { Separator } from "@radix-ui/react-separator";

const StyledButton = styled(Button, {
  "&:hover": {
    backgroundColor: "$gray3",
  },
});

const StyledSeparator = styled(Separator, {
  width: "1px",
  background: "$gray7",
  marginInline: "$1",
});

type PreviewNavigationProps = {
  interpreter: Interpreter;
  snapshot: Interpreter;
};

export function Navigation({ interpreter, snapshot }: PreviewNavigationProps) {
  const answer = useWatch({ name: "relationId" });

  return (
    <Box css={{ display: "flex", justifyContent: "center" }}>
      <StyledButton
        variant="ghost"
        onClick={() => interpreter.goBack()}
        disabled={!snapshot.hasHistory}
        css={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      >
        <Icon label="Zurück">
          <ArrowLeft />
        </Icon>
        Zurück
      </StyledButton>
      <StyledSeparator orientation="vertical" />
      <StyledButton
        variant="ghost"
        css={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        type="submit"
        disabled={!answer}
      >
        Weiter
        <Icon label="Weiter">
          <ArrowRight />
        </Icon>
      </StyledButton>
    </Box>
  );
}
