import { Button, Icon, Stack } from "@open-legal-tech/design-system";
import { useTree } from "features/Builder/state/treeMachine/useTree";
import { ArrowLeft, ArrowRight } from "react-feather";

export function UndoRedo() {
  const [, send] = useTree();

  return (
    <Stack
      css={{
        flexDirection: "row",
        position: "absolute",
        bottom: 10,
        left: 10,
        gap: "$2",
      }}
    >
      <Button
        variant="secondary"
        size="extra-small"
        onClick={() => send({ type: "undo" })}
      >
        <Icon>
          <ArrowLeft />
        </Icon>
      </Button>
      <Button
        variant="secondary"
        size="extra-small"
        onClick={() => send({ type: "redo" })}
      >
        <Icon>
          <ArrowRight />
        </Icon>
      </Button>
    </Stack>
  );
}
