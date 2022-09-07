import {
  Form,
  NodeLinkProps,
  TargetSelector,
} from "@open-decision/design-system";
import { Tree } from "@open-decision/type-classes";

type FreeTextInputConfiguratorProps = {
  nodeId: string;
  inputId: string;
  tree: Tree.TTree;
} & Pick<NodeLinkProps, "onClick">;

export const FreeTextInputConfigurator = ({
  nodeId,
  inputId,
  tree,
  onClick,
}: FreeTextInputConfiguratorProps) => {
  const treeClient = useTreeClient(tree);
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
          treeClient.input.freeText.createTargetNode(nodeId, inputId, {
            name: value,
          })
        }
        onSelect={(newItem) =>
          treeClient.input.freeText.updateTarget({
            edgeId: edge?.id,
            nodeId,
            inputId,
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
