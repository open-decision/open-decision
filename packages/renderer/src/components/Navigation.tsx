import * as React from "react";
import { Icon, Button, Row, Form, Tooltip } from "@open-decision/design-system";
import { useInterpreter } from "@open-decision/interpreter-react";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

type Props = {
  className?: string;
  successButtonLabel?: React.ReactNode;
  onGoBack?: () => void;
  canGoBack?: true;
  isStartNode: boolean;
  isFinalNode?: true;
};

export function Navigation({
  className,
  successButtonLabel,
  isStartNode,
  isFinalNode,
}: Props) {
  const { isInteractive } = useInterpreter();
  const [open, setOpen] = React.useState(false);

  const { isModule } = useInterpreter();

  return (
    <Tooltip.Root open={!isInteractive && open} onOpenChange={setOpen}>
      <Tooltip.Trigger asChild>
        <Row
          classNames={["max-w-max gap-2 py-4 lg:py-6 rounded-md", className]}
        >
          <BackButton
            className={
              isStartNode && !isModule
                ? "opacity-0 pointer-events-none"
                : "opacity-100"
            }
            disabled={isStartNode && !isModule}
          />
          <Form.SubmitButton
            form="form"
            classNames={[
              isInteractive ? "" : "pointer-events-none",
              isFinalNode && !isModule
                ? "opacity-0 pointer-events-none"
                : "opacity-100",
            ]}
            disabled={(isFinalNode && !isModule) || !isInteractive}
          >
            {successButtonLabel ? successButtonLabel : "Zum nächsten Schritt"}
          </Form.SubmitButton>
        </Row>
      </Tooltip.Trigger>
      <Tooltip.Content>
        Die Vorschau ist nicht interaktiv. Um mit dem Baum zu interagieren nutze
        bitte die Prototypansicht.
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

type BackButtonProps = { className?: string; disabled?: boolean };

export function BackButton({ className, disabled }: BackButtonProps) {
  const { send, canGoBack } = useInterpreter();

  return (
    <Button
      variant="neutral"
      onClick={() => {
        return send("GO_BACK");
      }}
      disabled={!canGoBack || disabled}
      classNames={["min-w-max", className]}
    >
      <Icon label="Zurück">
        <ArrowLeftIcon />
      </Icon>
      Zurück
    </Button>
  );
}
