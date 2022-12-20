import { Icon, Button, Row, Form } from "@open-decision/design-system";
import { useInterpreter } from "@open-decision/interpreter-react";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";

type Props = {
  className?: string;
  successButtonLabel?: React.ReactNode;
};

export function Navigation({ className, successButtonLabel }: Props) {
  const { send, canGoBack, canGoForward } = useInterpreter();

  return (
    <Row classNames={["p-2 max-w-max gap-2 rounded-md", className]}>
      <Button
        variant="neutral"
        onClick={() => send("GO_BACK")}
        disabled={!canGoBack}
      >
        <Icon label="Zurück">
          <ArrowLeftIcon />
        </Icon>
        Zurück
      </Button>
      {canGoForward ? (
        <Button onClick={() => send("GO_FORWARD")}>
          Vor
          <Icon label="Vorwärts">
            <ArrowRightIcon />
          </Icon>
        </Button>
      ) : (
        <Form.SubmitButton form="form">
          {successButtonLabel ? successButtonLabel : "Zum nächsten Schritt"}
          <Icon label="Vorwärts">
            <ArrowRightIcon />
          </Icon>
        </Form.SubmitButton>
      )}
    </Row>
  );
}
