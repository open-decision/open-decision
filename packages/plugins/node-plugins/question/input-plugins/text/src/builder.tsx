import { Form, TargetSelector } from "@open-decision/design-system";
import { InputComponentProps } from "@open-decision/input-plugins-helpers";
import { TextInputPlugin, TTextInput } from "./plugin";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { getEdgesByNode, getNodeOptions } from "@open-decision/tree-type";
import { createTargetNode } from "@open-decision/node-plugins-helpers";
import { DirectConditionPlugin } from "@open-decision/condition-plugins-direct";

export const BuilderComponent = ({
  nodeId,
  input,
  onClick,
}: InputComponentProps<TTextInput>) => {
  const treeClient = useTreeClient();
  const FreeText = new TextInputPlugin(treeClient);
  const DirectCondition = new DirectConditionPlugin(treeClient);

  const edge = useTree(
    (tree) => Object.values(getEdgesByNode(tree)(nodeId)?.source ?? {})?.[0]
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
        onCreate={(value) => {
          const condition = DirectCondition.create();
          return createTargetNode(treeClient)(
            nodeId,
            condition.id,
            treeClient.nodes.create.node({
              name: value,
            })
          );
        }}
        onSelect={(newItem) =>
          FreeText.updateTarget({
            edgeId: edge?.["id"],
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
