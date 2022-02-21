import { Button, Icon, Stack } from "@open-legal-tech/design-system";
import { undoManager } from "features/Builder/state/treeStore/treeStore";
import { ArrowLeft, ArrowRight } from "react-feather";

export function UndoRedo() {
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
        onClick={() => undoManager.undo()}
        disabled={!undoManager.canUndo()}
      >
        <Icon>
          <ArrowLeft />
        </Icon>
      </Button>
      <Button
        variant="secondary"
        size="extra-small"
        onClick={() => undoManager.redo()}
        disabled={!undoManager.canRedo()}
      >
        <Icon>
          <ArrowRight />
        </Icon>
      </Button>
    </Stack>
  );
}
