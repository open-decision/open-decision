import {
  EdgePlugin,
  IEdgePlugin,
  TNodeId,
  TReadOnlyTreeClient,
  TTreeClient,
} from "@open-decision/tree-type";
import {
  InterpreterContext,
  EVALUATE_NODE_CONDITIONS,
} from "@open-decision/interpreter";
import { ODError, ODProgrammerError } from "@open-decision/type-classes";
import { z } from "zod";
import { mapValues } from "remeda";

export type EdgeResolver<TType extends IEdgePlugin> = (
  treeClient: TTreeClient | TReadOnlyTreeClient
) => (
  edge: TType
) => (
  context: InterpreterContext,
  event: EVALUATE_NODE_CONDITIONS
) =>
  | { state: "success"; target: TNodeId }
  | { state: "failure" }
  | { state: "error"; error: ODProgrammerError | ODError };

export type EdgePluginObject<
  TType extends IEdgePlugin = IEdgePlugin,
  TZodType extends z.AnyZodObject = z.AnyZodObject
> = {
  plugin: EdgePlugin<TType>;
  resolver: EdgeResolver<TType>;
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
