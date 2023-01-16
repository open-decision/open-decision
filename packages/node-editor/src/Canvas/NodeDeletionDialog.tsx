import { Dialog, Text } from "@open-decision/design-system";
import { useTreeClient } from "@open-decision/tree-sync";
import { TNodeId } from "@open-decision/tree-type";
import { useEditor } from "../state";

type Props = Dialog.TriggerProps & {
  open?: boolean;
  focusOnCancel?: () => void;
  onSuccess?: () => void;
  onCancel?: () => void;
  nodesToDelete: TNodeId[];
};

export function NodeDeletionDialog({
  children,
  open,
  onCancel,
  nodesToDelete,
  onSuccess,
}: Props) {
  const { removeSelectedNodes } = useEditor();
  const treeClient = useTreeClient();

  return (
    <Dialog.Root open={open} onOpenChange={onCancel}>
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Content>
          <Dialog.Header className="mb-2">
            Bist du sicher, dass du die Knoten löschen willst?
          </Dialog.Header>
          <Text>Dies kann nicht rückgängig gemacht werden.</Text>
          <Dialog.ButtonRow
            type="button"
            colorScheme="danger"
            onClick={() => {
              removeSelectedNodes();
              treeClient.nodes.delete(nodesToDelete);
              onSuccess?.();
            }}
          >
            Löschen
          </Dialog.ButtonRow>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
