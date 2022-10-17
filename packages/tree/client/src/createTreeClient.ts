import { ODValidationError } from "@open-decision/type-classes";
import {
  Tree,
  createTreeClient as createBaseTreeClient,
} from "@open-decision/tree-type";
import { z } from "zod";
import { ConditionPlugin } from "@open-decision/condition-plugins-helpers";
import { NodePlugin } from "@open-decision/node-editor";

export const createTreeClient = <
  TExtendedTree extends Omit<Tree.TTree, "startNode" | "edge">,
  NodePlugins extends Record<string, NodePlugin<any, any>>,
  ConditionPlugins extends Record<string, ConditionPlugin<any, any>>,
  NodeType extends z.ZodType,
  ConditionType extends z.ZodType
>(
  plugins: {
    nodes: [NodePlugins, NodeType];
    conditions: [ConditionPlugins, ConditionType];
    pluginEntities?: z.ZodTypeAny;
  },
  tree: Omit<Tree.TTree, "inputs" | "nodes" | "conditions"> & TExtendedTree
) => {
  const mergedTreeTypes = Tree.Type.merge(
    z.object({
      conditions: z.record(plugins.conditions[1]),
      nodes: z.record(plugins.nodes[1]),
      pluginEntities: plugins.pluginEntities ? plugins.pluginEntities : z.any(),
    })
  );

  const extendedTreeClient = createBaseTreeClient(tree);

  const treeClientWithTypes = {
    Type: mergedTreeTypes,
    ...extendedTreeClient,
    nodes: {
      ...extendedTreeClient.nodes,
      Type: plugins.nodes[1],
    },
    conditions: {
      ...extendedTreeClient.conditions,
      Type: plugins.conditions[1],
    },
    condition: plugins.conditions[0],
    node: plugins.nodes[0],
  };

  return treeClientWithTypes;
};

export type TTreeClient = ReturnType<typeof createTreeClient>;
