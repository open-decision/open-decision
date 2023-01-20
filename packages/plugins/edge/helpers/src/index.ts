import {
  EdgePlugin,
  IEdge,
  TReadOnlyTreeClient,
  TTreeClient,
} from "@open-decision/tree-type";
import { EVALUATE_NODE_CONDITIONS } from "@open-decision/interpreter";
import { ODError, ODProgrammerError } from "@open-decision/type-classes";
import { z } from "zod";
import { mapValues } from "remeda";
import { TModuleVariableValue } from "@open-decision/variables";
import { TNodeId } from "@open-decision/tree-ids";

export type EdgeResolver<TType extends IEdge> = (
  treeClient: TTreeClient | TReadOnlyTreeClient
) => (
  edge: TType
) => (
  context: TModuleVariableValue,
  event: EVALUATE_NODE_CONDITIONS
) =>
  | { state: "success"; target: TNodeId }
  | { state: "failure" }
  | { state: "error"; error: ODProgrammerError | ODError };

export type EdgePluginObject<
  TType extends IEdge = IEdge,
  TResolver extends EdgeResolver<any> = EdgeResolver<any>,
  TZodType extends z.AnyZodObject = z.AnyZodObject
> = {
  plugin: EdgePlugin<TType>;
  resolver: TResolver;
  type: TType["type"];
  Type: TZodType;
};

export const createEdgePluginObject = <
  TPluginObject extends EdgePluginObject = EdgePluginObject
>(
  pluginObj: TPluginObject
) => pluginObj satisfies TPluginObject;

export const createEdgePluginGroup = <
  TEdgePlugins extends Record<string, EdgePluginObject>
>(
  edgePlugins: TEdgePlugins
) => {
  const plugins = mapValues(edgePlugins, (plugin) => plugin.plugin);

  return {
    plugins,
    pluginObjects: edgePlugins,
  };
};

export type TEdgePluginGroup = ReturnType<typeof createEdgePluginGroup>;
