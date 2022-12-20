import { createDecisionNodePlugin } from "@open-decision/plugins-node-decision";
import { createDocumentNodePlugin } from "@open-decision/plugins-node-document";
import { z } from "zod";
import { Tree } from "@open-decision/tree-type";
import { createInfoNodePlugin } from "@open-decision/plugins-node-info";
import { createFormNodePlugin } from "@open-decision/plugins-node-form";
import {
  createPlaceholderNodePlugin,
  createGroupNodePlugin,
} from "@open-decision/node-editor";
import { createCompareEdgePlugin } from "@open-decision/plugins-edge-compare";
import { createDirectEdgePlugin } from "@open-decision/plugins-edge-direct";
import { createTreeClient } from "./createTreeClient";

export const createTreeClientWithPlugins = (tree: Tree.TTree) => {
  const CompareEdge = createCompareEdgePlugin();
  const DirectEdge = createDirectEdgePlugin();

  const EdgePlugins = {
    [CompareEdge.plugin.typeName]: CompareEdge.plugin,
    [DirectEdge.plugin.typeName]: DirectEdge.plugin,
  };

  const Edges = {
    [CompareEdge.plugin.typeName]: CompareEdge,
    [DirectEdge.plugin.typeName]: DirectEdge,
  };

  const EdgeType = z.discriminatedUnion("type", [
    CompareEdge.plugin.Type,
    DirectEdge.plugin.Type,
  ]);

  const DecisionNode = createDecisionNodePlugin();
  const DocumentNode = createDocumentNodePlugin();
  const InfoNode = createInfoNodePlugin();
  const FormNode = createFormNodePlugin();

  const NodePlugins = {
    [DecisionNode.plugin.typeName]: DecisionNode.plugin,
    [DocumentNode.plugin.typeName]: DocumentNode.plugin,
    [InfoNode.plugin.typeName]: InfoNode.plugin,
    [FormNode.plugin.typeName]: FormNode.plugin,
  };

  const Nodes = {
    [DecisionNode.plugin.typeName]: DecisionNode,
    [DocumentNode.plugin.typeName]: DocumentNode,
    [InfoNode.plugin.typeName]: InfoNode,
    [FormNode.plugin.typeName]: FormNode,
  };

  const GroupNode = createGroupNodePlugin(Edges, Nodes);
  const PlaceholderNode = createPlaceholderNodePlugin(
    {
      ...Nodes,
      [GroupNode.plugin.typeName]: GroupNode,
    },
    Edges
  );

  const NodeType = z.discriminatedUnion("type", [
    DecisionNode.plugin.Type,
    DocumentNode.plugin.Type,
    PlaceholderNode.plugin.Type,
    InfoNode.plugin.Type,
    FormNode.plugin.Type,
    GroupNode.plugin.Type,
  ]);

  const treeClient = createTreeClient(
    {
      nodes: [
        {
          ...NodePlugins,
          [PlaceholderNode.plugin.typeName]: PlaceholderNode.plugin,
        },
        NodeType,
      ],
      edges: [EdgePlugins, EdgeType],
      pluginEntities: z.object({
        inputs: z
          .union([
            DecisionNode.pluginEntities.inputs,
            FormNode.pluginEntities.inputs,
          ])
          .optional(),
      }),
    },
    tree
  );

  return {
    treeClient,
    nodePlugins: {
      ...Nodes,
      [GroupNode.plugin.typeName]: GroupNode,
      [PlaceholderNode.plugin.typeName]: PlaceholderNode,
    },
    edgePlugins: Edges,
  };
};
