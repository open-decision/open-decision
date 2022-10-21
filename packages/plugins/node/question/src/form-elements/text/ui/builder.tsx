import { Form, TargetSelector } from "@open-decision/design-system";
import { InputComponentProps } from "../../helpers";
import { TextInputPlugin, TTextInput } from "../textPlugin";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { createTargetNode } from "@open-decision/node-plugins-helpers";
import { DirectConditionPlugin } from "@open-decision/plugins-condition-direct";

export const BuilderComponent = ({
  nodeId,
  input,
  onTargetSelect,
  onNodeCreate,
}: InputComponentProps<TTextInput>) => {
  const treeClient = useTreeClient();
  const FreeText = new TextInputPlugin(treeClient);
  const DirectCondition = new DirectConditionPlugin(treeClient);

  const edge = useTree(
    (treeClient) =>
      Object.values(treeClient.edges.get.byNode(nodeId)?.source ?? {})?.[0]
  );

  const nodeNames = useTree((treeClient) =>
    Object.values(treeClient.nodes.get.options(nodeId, "Ohne Name"))
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
            onNodeCreate({ name: value })
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
        onClick={onTargetSelect}
        value={formState.values.target}
        setValue={(newValue) =>
          formState.setValue(formState.names.target, newValue)
        }
        selectOptions={nodeNames}
      />
    </Form.Root>
  );
};
