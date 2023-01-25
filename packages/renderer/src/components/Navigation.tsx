import * as React from "react";
import { Icon, Button, Form, Tooltip } from "@open-decision/design-system";
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
        <div
          className={`grid auto-cols-fr grid-flow-col gap-2 pt-4 pb-2 lg:py-4 rounded-md ${className}`}
        >
          {isStartNode && !isModule ? null : <BackButton />}
          {isFinalNode && !isModule ? null : (
            <Form.SubmitButton
              form="form"
              className={isInteractive ? "" : "pointer-events-none"}
            >
              {successButtonLabel ? successButtonLabel : "Zum nächsten Schritt"}
            </Form.SubmitButton>
          )}
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content>
        Die Vorschau ist nicht interaktiv. Um mit dem Baum zu interagieren nutze
        bitte die Prototypansicht.
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

type BackButtonProps = { classNames?: string[]; disabled?: boolean };

export function BackButton({ classNames, disabled }: BackButtonProps) {
  const { send, canGoBack } = useInterpreter();

  return (
    <Button
      variant="secondary"
      onClick={() => {
        return send("GO_BACK");
      }}
      disabled={!canGoBack || disabled}
      classNames={["colorScheme-gray", classNames]}
    >
      <Icon label="Zurück">
        <ArrowLeftIcon />
      </Icon>
      Zurück
    </Button>
  );
}
