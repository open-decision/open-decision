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
          className={`grid grid-cols-2 gap-2 pt-4 pb-2 lg:py-6 rounded-md ${className}`}
        >
          <BackButton
            classNames={[
              isStartNode && !isModule
                ? "opacity-0 pointer-events-none"
                : "opacity-100",
            ]}
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
        </div>
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
      variant="secondary"
      onClick={() => {
        return send("GO_BACK");
      }}
      disabled={!canGoBack || disabled}
      classNames={["colorScheme-gray", className]}
    >
      <Icon label="Zurück">
        <ArrowLeftIcon />
      </Icon>
      Zurück
    </Button>
  );
}
