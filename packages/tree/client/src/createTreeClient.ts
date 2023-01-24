import { Tree, TreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import { merge } from "remeda";
import { TNodePluginGroup } from "@open-decision/plugins-node-helpers";
import { TEdgePluginGroup } from "@open-decision/plugins-edge-helpers";

export const createTreeClient = <
  TExtendedTree extends Omit<Tree.TTree, "startNode" | "edge">,
  NodePlugins extends TNodePluginGroup,
  ConditionPlugins extends TEdgePluginGroup,
  NodeType extends z.ZodType,
  ConditionType extends z.ZodType,
  TPluginEntities extends z.ZodType
>(
  treeUuid: string,
  plugins: {
    nodes: [NodePlugins, NodeType];
    edges: [ConditionPlugins, ConditionType];
    pluginEntities: TPluginEntities;
  },
  tree: Omit<Tree.TTree, "inputs" | "nodes"> & TExtendedTree
) => {
  const mergedTreeTypes = Tree.Type.merge(
    z.object({
      edges: z.record(plugins.edges[1]),
      nodes: z.record(plugins.nodes[1]),
      pluginEntities: plugins.pluginEntities,
    })
  );

  const treeClient = new TreeClient(treeUuid, tree);

  const treeClientWithTypes = merge(treeClient, {
    Type: mergedTreeTypes,
    nodes: {
      Type: plugins.nodes[1],
    },
    edges: {
      Type: plugins.edges[1],
    },
  });

  return treeClientWithTypes;
};

export type TTreeClient = ReturnType<typeof createTreeClient>;
