import { Form, TargetSelector } from "@open-decision/design-system";
import { InputComponentProps } from "@open-decision/input-plugins-helpers";
import { FreeTextPlugin, TFreeTextInput } from "./freeTextPlugin";

export const FreeText = ({
  nodeId,
  input,
  treeClient,
  onClick,
}: InputComponentProps<TFreeTextInput>) => {
  const FreeText = new FreeTextPlugin(treeClient);

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
        selectOptions={nodeOptions}
      />
    </Form.Root>
  );
};
