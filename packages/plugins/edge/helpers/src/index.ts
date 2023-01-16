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
import { ODProgrammerError } from "@open-decision/type-classes";
import { z } from "zod";

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
  | { state: "error"; error: ODProgrammerError };

export type EdgePluginObject<TType extends IEdgePlugin = IEdgePlugin> = {
  plugin: EdgePlugin<TType>;
  resolver: EdgeResolver<TType>;
  type: TType["type"];
  Type: z.ZodType<TType>;
};

export const createEdgePluginObject = <TType extends IEdgePlugin = IEdgePlugin>(
  pluginObj: EdgePluginObject<TType>
) => pluginObj satisfies EdgePluginObject<TType>;
