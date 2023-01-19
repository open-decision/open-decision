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
import { createNodePluginGroup } from "@open-decision/plugins-node-helpers";
import { createEdgePluginGroup } from "@open-decision/plugins-edge-helpers";

export const createTreeClientWithPlugins = (tree: Tree.TTree) => {
  const Edges = createEdgePluginGroup({
    [CompareEdgePluginObject.type]: CompareEdgePluginObject,
    [DirectEdgePluginObject.type]: DirectEdgePluginObject,
  });

  const EdgeType = z.discriminatedUnion("type", [
    CompareEdgePluginObject.Type,
    DirectEdgePluginObject.Type,
  ]);

  const Nodes = createNodePluginGroup(
    {
      [DocumentNodePluginObject.type]: DocumentNodePluginObject,
      [InfoNodePluginObject.type]: InfoNodePluginObject,
      [PlaceholderNodePluginObject.plugin.type]: PlaceholderNodePluginObject,
    },
    {
      [DecisionNodePluginObject.type]: DecisionNodePluginObject,
      [FormNodePluginObject.type]: FormNodePluginObject,
      [GroupNodePluginObject.plugin.type]: GroupNodePluginObject,
    }
  );

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
      nodes: [Nodes, NodeType],
      edges: [Edges, EdgeType],
      pluginEntities: FormNodePluginObject.pluginEntities
        ? z.record(FormNodePluginObject.pluginEntities.inputs)
        : z.undefined(),
    },
    tree
  );

  return {
    treeClient,
    nodePlugins: Nodes,
    edgePlugins: Edges,
  };
};
