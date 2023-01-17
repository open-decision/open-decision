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
    [CompareEdgePluginObject.plugin.type]: CompareEdgePluginObject.plugin,
    [DirectEdgePluginObject.plugin.type]: DirectEdgePluginObject.plugin,
  };

  const Edges = {
    [CompareEdgePluginObject.plugin.type]: CompareEdgePluginObject,
    [DirectEdgePluginObject.plugin.type]: DirectEdgePluginObject,
  };

  const EdgeType = z.discriminatedUnion("type", [
    CompareEdgePluginObject.Type,
    DirectEdgePluginObject.Type,
  ]);

  const NodePlugins = {
    [DecisionNodePluginObject.plugin.type]: DecisionNodePluginObject.plugin,
    [DocumentNodePluginObject.plugin.type]: DocumentNodePluginObject.plugin,
    [InfoNodePluginObject.plugin.type]: InfoNodePluginObject.plugin,
    [FormNodePluginObject.plugin.type]: FormNodePluginObject.plugin,
  };

  const Nodes = {
    [DecisionNodePluginObject.plugin.type]: DecisionNodePluginObject,
    [DocumentNodePluginObject.plugin.type]: DocumentNodePluginObject,
    [InfoNodePluginObject.plugin.type]: InfoNodePluginObject,
    [FormNodePluginObject.plugin.type]: FormNodePluginObject,
  };

  const NodeType = z.discriminatedUnion("type", [
    DecisionNodePluginObject.Type,
    DocumentNodePluginObject.Type,
    PlaceholderNodePluginObject.Type,
    InfoNodePluginObject.Type,
    FormNodePluginObject.Type,
    GroupNodePluginObject.Type,
  ]);

  const treeClient = createTreeClient(
    {
      nodes: [
        {
          ...NodePlugins,
          [PlaceholderNodePluginObject.plugin.type]:
            PlaceholderNodePluginObject.plugin,
        },
        NodeType,
      ],
      edges: [EdgePlugins, EdgeType],
      pluginEntities: FormNodePluginObject.pluginEntities?.inputs,
    },
    tree
  );

  return {
    treeClient,
    nodePlugins: {
      ...Nodes,
      [GroupNodePluginObject.plugin.type]: GroupNodePluginObject,
      [PlaceholderNodePluginObject.plugin.type]: PlaceholderNodePluginObject,
    },
    edgePlugins: Edges,
  };
};
