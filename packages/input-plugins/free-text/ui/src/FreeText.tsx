import { Form, TargetSelector } from "@open-decision/design-system";
import { InputComponentProps } from "@open-decision/input-plugin-helpers";
import { TFreeTextInput } from "@open-decision/free-text-input-plugin";

export const FreeText = ({
  nodeId,
  input,
  treeClient,
  onClick,
}: InputComponentProps<TFreeTextInput>) => {
  //FIXME I cannot just assume there is ony one edge
  const edge = treeClient.edges.get.byNode(nodeId)[0];
  const nodeOptions = treeClient.nodes.get.options(nodeId, edge);

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
        edge={edge}
        onCreate={(value) =>
          treeClient.input.freeText.createTargetNode(nodeId, input.id, {
            name: value,
          })
        }
        onSelect={(newItem) =>
          treeClient.input.freeText.updateTarget({
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
        selectOptions={nodeOptions}
      />
    </Form.Root>
  );
};
