import { ODValidationError } from "@open-decision/type-classes";
import {
  Tree,
  createTreeClient as createBaseTreeClient,
} from "@open-decision/tree-type";
import { z } from "zod";
import { mergeDeepRight } from "ramda";
import { InputPlugin } from "@open-decision/input-plugins-helpers";
import { ConditionPlugin } from "@open-decision/condition-plugins-helpers";
import { NodePlugin } from "@open-decision/node-editor";

export const createTreeClient = <
  TExtendedTree extends Omit<Tree.TTree, "startNode" | "edge">,
  InputPlugins extends Record<string, InputPlugin<any, any>>,
  NodePlugins extends Record<string, NodePlugin<any, any>>,
  ConditionPlugins extends Record<string, ConditionPlugin<any, any>>,
  InputType extends z.ZodType,
  NodeType extends z.ZodType,
  ConditionType extends z.ZodType
>(
  plugins: {
    inputs: [InputPlugins, InputType];
    nodes: [NodePlugins, NodeType];
    conditions: [ConditionPlugins, ConditionType];
  },
  tree: Omit<Tree.TTree, "inputs" | "nodes" | "conditions"> & TExtendedTree
) => {
  const mergedTreeTypes = Tree.Type.merge(
    z.object({
      inputs: z.record(plugins.inputs[1]).optional(),
      conditions: z.record(plugins.conditions[1]).optional(),
      nodes: z.record(plugins.nodes[1]).optional(),
    })
  );

  const extendedTree = mergedTreeTypes.safeParse(tree);

  if (!extendedTree.success) {
    console.error(extendedTree.error);
    throw new ODValidationError({
      code: "INVALID_DATA",
      zodError: extendedTree.error,
    });
  }

  const extendedTreeClient = createBaseTreeClient(
    tree as z.infer<typeof mergedTreeTypes>
  );

  const treeClientWithTypes = {
    Type: mergedTreeTypes,
    ...extendedTreeClient,
    nodes: {
      ...extendedTreeClient.nodes,
      Type: plugins.nodes[1],
    },
    inputs: {
      ...extendedTreeClient.inputs,
      Type: plugins.inputs[1],
    },
    conditions: {
      ...extendedTreeClient.conditions,
      Type: plugins.conditions[1],
    },
    input: plugins.inputs[0],
    condition: plugins.conditions[0],
    node: plugins.nodes[0],
  };

  return mergeDeepRight(treeClientWithTypes, {
    inputs: {
      update: {
        type: (
          inputId: string,
          newInput: Omit<z.infer<typeof treeClientWithTypes.inputs.Type>, "id">
        ) => {
          treeClientWithTypes.inputs.update(inputId, newInput);
        },
      },
    },
  });
};

export type TTreeClient = ReturnType<typeof createTreeClient>;
