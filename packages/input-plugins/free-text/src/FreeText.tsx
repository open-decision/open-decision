import {
  Form,
  NodeLinkProps,
  TargetSelector,
} from "@open-decision/design-system";
import { createUseTree, Edge, Tree } from "@open-decision/type-classes";
import { treeClientConfig, TTreeClient } from "./freeTextPlugin";

type FreeTextInputConfiguratorProps = {
  nodeId: string;
  inputId: string;
  treeClient: TTreeClient;
  tree: Tree.TTree;
} & Pick<NodeLinkProps, "onClick">;

export const FreeTextInputConfigurator = ({
  nodeId,
  inputId,
  treeClient,
  tree,
  onClick,
}: FreeTextInputConfiguratorProps) => {
  const useTree = createUseTree(tree, treeClientConfig);
  //FIXME I cannot just assume there is ony one edge
  const edge = useTree((treeClient) => treeClient.edges.getBy.node(nodeId)[0]);
  const nodeOptions = useTree((treeClient) =>
    treeClient.nodes.get.options(nodeId, edge)
  );

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
