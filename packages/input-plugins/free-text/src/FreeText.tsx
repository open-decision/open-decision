import { Form } from "@open-decision/design-system";
import { useNotificationStore } from "../../../../Notifications/NotificationState";
import { useEdgesOfNode } from "../../../state/treeStore/hooks";
import { useNodeOptions } from "../../../state/treeStore/hooks/useNodeOptions";
import { useTreeContext } from "../../../state/treeStore/TreeContext";
import { TargetSelector } from "../TargetSelector";

type FreeTextInputConfiguratorProps = {
  nodeId: string;
  inputId: string;
};

export const FreeTextInputConfigurator = ({
  nodeId,
  inputId,
}: FreeTextInputConfiguratorProps) => {
  const edge = Object.values(useEdgesOfNode(nodeId))[0];

  const {
    createAndAddEdge,
    relateConditionToNode,
    updateEdgeTarget,
    addNode,
    addCondition,
    createInput,
    addEdge,
    createChildNode,
    createCondition,
    createEdge,
    addInput,
  } = useTreeContext();
  const { addNotification } = useNotificationStore();

  function handleCreate(name: string) {
    const newInput = createInput();
    const childNode = createChildNode(nodeId, {
      data: {
        inputs: [newInput.id],
        name,
        conditions: [],
      },
    });

    if (childNode instanceof Error) return childNode;

    if (edge?.target) {
      updateEdgeTarget(edge.id, childNode.id);
    } else {
      // Construct the Relationship
      const newCondition = createCondition({
        inputId,
        type: "always",
      });

      const newEdge = createEdge({
        source: nodeId,
        target: childNode.id,
        conditionId: newCondition.id,
      });

      if (newEdge instanceof Error) {
        addNotification({
          title: "Es konnte keine verbundender Knoten erstellt werden.",
          content: newEdge.message,
          variant: "danger",
        });

        return newEdge;
      }

      addCondition(newCondition);
      relateConditionToNode(nodeId, newCondition.id);
      addEdge(newEdge);
    }

    addInput(newInput);
    addNode(childNode);

    return { id: childNode.id, label: childNode.data.name };
  }

  function handleSelect(newItem: string) {
    if (!edge?.target && newItem) {
      const newCondition = createCondition({
        inputId,
        type: "always",
      });

      addCondition(newCondition);
      relateConditionToNode(nodeId, newCondition.id);

      createAndAddEdge({
        source: nodeId,
        target: newItem,
        conditionId: newCondition.id,
      });
    }

    if (edge?.target && newItem) updateEdgeTarget(edge.id, newItem);
  }

  const nodeOptions = useNodeOptions(nodeId, edge);

  const formState = Form.useFormState({
    defaultValues: {
      target:
        nodeOptions.find((nodeOption) => nodeOption.id === edge?.target)
          ?.name ?? "",
    },
  });

  return (
    <Form.Root state={formState} css={{ groupColor: "$colorScheme-text" }}>
      <TargetSelector
        name={formState.names.target}
        nodeId={nodeId}
        edge={edge}
        onCreate={handleCreate}
        onSelect={handleSelect}
        value={formState.values.target}
        setValue={(newValue) =>
          formState.setValue(formState.names.target, newValue)
        }
        selectOptions={nodeOptions}
      />
    </Form.Root>
  );
};
