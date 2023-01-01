import { createNode, createChildNode, createEdge } from "./creators";
import {
  getNode,
  getNodes,
  getEdge,
  getEdges,
  getEdgesByNode,
  getNodeOptions,
  getNodesByEdge,
  getPluginEntity,
  getPluginEntities,
  getEntirePluginEntity,
  getStartNodeId,
  getNodeNames,
} from "./getters";
import {
  deleteNodes,
  addNode,
  updateNodeName,
  updateNodePosition,
  deleteEdges,
  addEdge,
  updateEdgeTarget,
  updateEdgeSource,
  addPluginEntity,
  updateNode,
  deletePluginEntity,
  updateEdge,
} from "./mutaters";
import { Tree } from "./type-classes";
import {
  getConnectableNodes,
  getChildren,
  getParents,
  getPaths,
  isCircular,
} from "./utils";
import { isValidEdge } from "./validators";
import type {} from "zod";
import { udpateRendererLabel } from "./mutaters/updateRendererLabel";
import { Theme } from "./type-classes/Theme";
import { z } from "zod";

export class ReadOnlyTreeClient<TTree extends Tree.TTree> {
  tree: Tree.TTree;
  constructor(tree: TTree) {
    this.tree = tree;
  }

  get pluginEntity() {
    return {
      get: {
        single: getPluginEntity(this.tree),
        all: getEntirePluginEntity(this.tree),
        collection: getPluginEntities(this.tree),
      },
    };
  }

  get nodes() {
    return {
      create: { node: createNode, childNode: createChildNode(this.tree) },
      get: {
        single: getNode(this.tree),
        collection: getNodes(this.tree),
        all: () => this.tree.nodes as TTree["nodes"],
        connectableNodes: getConnectableNodes(this.tree),
        children: getChildren(this.tree),
        parents: getParents(this.tree),
        paths: getPaths(this.tree),
        options: getNodeOptions(this.tree),
        names: getNodeNames(this.tree),
        byEdge: getNodesByEdge(this.tree),
      },
    };
  }

  // get conditions() {
  //   return {
  //     create: createCondition,
  //     get: {
  //       single: getCondition(this.tree),
  //       collection: getConditions(this.tree),
  //       all: getAllConditions(this.tree),
  //       byEdge: getConditionByEdge(this.tree),
  //       byNode: getConditionsByNode(this.tree),
  //     },
  //   };
  // }
  get edges() {
    return {
      create: createEdge(this.tree),
      get: {
        single: getEdge(this.tree),
        collection: getEdges(this.tree),
        all: () => this.tree.edges,
        byNode: getEdgesByNode(this.tree),
      },
    };
  }
  get = {
    tree: () => this.tree,
    startNodeId: () => getStartNodeId(this.tree),
    id: () => this.tree.uuid,
  };
}

export type TReadOnlyTreeClient = ReadOnlyTreeClient<Tree.TTree>;

export type TTreeClient = TreeClient<Tree.TTree>;

export class TreeClient<TTree extends Tree.TTree> {
  private tree: Tree.TTree;
  private ReadOnlyTreeClient: ReadOnlyTreeClient<Tree.TTree>;
  constructor(tree: TTree) {
    this.tree = tree;
    this.ReadOnlyTreeClient = new ReadOnlyTreeClient(tree);
  }

  updateTheme(newTheme: z.infer<typeof Theme>) {
    this.tree.theme = newTheme;
  }

  get get() {
    return this.ReadOnlyTreeClient.get;
  }
  updateStartNode(startNode: string) {
    // We only get the node to make sure it exists.
    getNode(this.tree)(startNode);

    this.tree.startNode = startNode;
  }

  get pluginEntity() {
    return {
      add: addPluginEntity(this.tree),
      delete: deletePluginEntity(this.tree),
      ...this.ReadOnlyTreeClient.pluginEntity,
    };
  }

  get nodes() {
    return {
      ...this.ReadOnlyTreeClient.nodes,
      delete: deleteNodes(this.tree),
      add: addNode(this.tree),
      connect: {
        toEdgeAsTarget: updateEdgeTarget(this.tree),
        toEdgeAsSource: updateEdgeSource(this.tree),
      },
      disconnect: {
        /**
         * Disconnecting from an Edge is equivalent to deleting it, because there cannot be
         * an Edge without source and target. If you want to update the connection
         * use nodes.connect.toEdgeAsTarget or edges.connect.toEdgeAsSource.
         */
        fromEdgeAsTarget: (id: string) => deleteEdges(this.tree)([id]),
        fromEdgeAsSource: (id: string) => deleteEdges(this.tree)([id]),
      },
      update: {
        name: updateNodeName(this.tree),
        position: updateNodePosition(this.tree),
        node: updateNode(this.tree),
        rendererLabel: udpateRendererLabel(this.tree),
      },
    };
  }
  // get conditions() {
  //   return {
  //     ...this.ReadOnlyTreeClient.conditions,
  //     delete: deleteConditions(this.tree),
  //     add: addCondition(this.tree),
  //     connect: {
  //       toEdge: connectEdgeAndCondition(this.tree),
  //     },
  //     disconnect: {
  //       fromEdge: disconnectEdgeAndCondition(this.tree),
  //     },
  //   };
  // }
  get edges() {
    return {
      ...this.ReadOnlyTreeClient.edges,
      delete: deleteEdges(this.tree),
      add: addEdge(this.tree),
      rules: {
        isCircular: isCircular(this.tree),
        isValid: isValidEdge(this.tree),
      },
      connect: {
        toTargetNode: updateEdgeTarget(this.tree),
        toSourceNode: updateEdgeSource(this.tree),
      },
      disconnect: {
        /**
         * Disconnecting an Edge is equivalent to deleting it, because there cannot be
         * an Edge without source and target. If you want to update the connection
         * use edges.connect.toTargetNode or edges.connect.toSourceNode.
         */
        fromTargetNode: (id: string) => deleteEdges(this.tree)([id]),
        /**
         * Disconnecting an Edge is equivalent to deleting it, because there cannot be
         * an Edge without source and target. If you want to update the connection
         * use edges.connect.toTargetNode or edges.connect.toSourceNode.
         */
        fromSourceNode: (id: string) => deleteEdges(this.tree)([id]),
      },
      update: updateEdge(this.tree),
    };
  }
}
