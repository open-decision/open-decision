import { DecisionNodePluginObject } from "@open-decision/plugins-node-decision";
import { DocumentNodePluginObject } from "@open-decision/plugins-node-document";
import { z } from "zod";
import { Tree } from "@open-decision/tree-type";
import { InfoNodePluginObject } from "@open-decision/plugins-node-info";
import { FormNodePluginObject } from "@open-decision/plugins-node-form";
import {
  PlaceholderNodePluginObject,
  GroupNodePluginObject,
} from "@open-decision/node-editor";
import { CompareEdgePluginObject } from "@open-decision/plugins-edge-compare";
import { DirectEdgePluginObject } from "@open-decision/plugins-edge-direct";
import { createTreeClient } from "./createTreeClient";

export const createTreeClientWithPlugins = (tree: Tree.TTree) => {
  const EdgePlugins = {
    [CompareEdgePluginObject.plugin.typeName]: CompareEdgePluginObject.plugin,
    [DirectEdgePluginObject.plugin.typeName]: DirectEdgePluginObject.plugin,
  };

  const Edges = {
    [CompareEdgePluginObject.plugin.typeName]: CompareEdgePluginObject,
    [DirectEdgePluginObject.plugin.typeName]: DirectEdgePluginObject,
  };

  const EdgeType = z.discriminatedUnion("type", [
    CompareEdgePluginObject.plugin.Type,
    DirectEdgePluginObject.plugin.Type,
  ]);

  const NodePlugins = {
    [DecisionNodePluginObject.plugin.typeName]: DecisionNodePluginObject.plugin,
    [DocumentNodePluginObject.plugin.typeName]: DocumentNodePluginObject.plugin,
    [InfoNodePluginObject.plugin.typeName]: InfoNodePluginObject.plugin,
    [FormNodePluginObject.plugin.typeName]: FormNodePluginObject.plugin,
  };

  const Nodes = {
    [DecisionNodePluginObject.plugin.typeName]: DecisionNodePluginObject,
    [DocumentNodePluginObject.plugin.typeName]: DocumentNodePluginObject,
    [InfoNodePluginObject.plugin.typeName]: InfoNodePluginObject,
    [FormNodePluginObject.plugin.typeName]: FormNodePluginObject,
  };

  const NodeType = z.discriminatedUnion("type", [
    DecisionNodePluginObject.plugin.Type,
    DocumentNodePluginObject.plugin.Type,
    PlaceholderNodePluginObject.plugin.Type,
    InfoNodePluginObject.plugin.Type,
    FormNodePluginObject.plugin.Type,
    GroupNodePluginObject.plugin.Type,
  ]);

  const treeClient = createTreeClient(
    {
      nodes: [
        {
          ...NodePlugins,
          [PlaceholderNodePluginObject.plugin.typeName]:
            PlaceholderNodePluginObject.plugin,
        },
        NodeType,
      ],
      edges: [EdgePlugins, EdgeType],
      pluginEntities: z.object({
        inputs: FormNodePluginObject.pluginEntities.inputs.optional(),
      }),
    },
    tree
  );

  return {
    treeClient,
    nodePlugins: {
      ...Nodes,
      [GroupNodePluginObject.plugin.typeName]: GroupNodePluginObject,
      [PlaceholderNodePluginObject.plugin.typeName]:
        PlaceholderNodePluginObject,
    },
    edgePlugins: Edges,
  };
};
