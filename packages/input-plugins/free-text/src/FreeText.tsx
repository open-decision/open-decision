import { Form, TargetSelector } from "@open-decision/design-system";
import { InputComponentProps } from "@open-decision/input-plugins-helpers";
import { FreeTextInputPlugin, TFreeTextInput } from "./freeTextPlugin";
import { useTree } from "@open-decision/tree-sync";
import { getEdgesByNode, getNodeOptions } from "@open-decision/tree-type";

export const FreeText = ({
  nodeId,
  input,
  treeClient,
  onClick,
}: InputComponentProps<TFreeTextInput>) => {
  const FreeText = new FreeTextInputPlugin(treeClient);

  const edge = useTree(
    (tree) => Object.values(getEdgesByNode(tree)(nodeId) ?? {})?.[0]
  );

  const nodeNames = useTree((tree) =>
    Object.values(getNodeOptions(tree)(nodeId, "Ohne Name"))
  );

  const formState = Form.useFormState({
    defaultValues: {
      target:
        Object.values(nodeNames ?? {}).find((node) => node.id === edge?.target)
          ?.name ?? "",
    },
  });

  return (
    <Form.Root state={formState} css={{ groupColor: "$colorScheme-text" }}>
      <TargetSelector
        name={formState.names.target}
        edge={edge}
        onCreate={(value) =>
          FreeText.createTargetNode(nodeId, input.id, {
            name: value,
          })
        }
        onSelect={(newItem) =>
          FreeText.updateTarget({
            edgeId: edge?.id,
            nodeId,
            inputId: input.id,
            newItem,
          })
        }
        onClick={onClick}
        value={formState.values.target}
        setValue={(newValue) =>
          formState.setValue(formState.names.target, newValue)
        }
        selectOptions={nodeNames}
      />
    </Form.Root>
  );
};
