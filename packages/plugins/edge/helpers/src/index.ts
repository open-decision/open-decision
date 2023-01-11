import {
  EdgePlugin,
  TEdgePlugin,
  TReadOnlyTreeClient,
  TTreeClient,
} from "@open-decision/tree-type";
import {
  InterpreterContext,
  EVALUATE_NODE_CONDITIONS,
} from "@open-decision/interpreter";
import { InterpreterError } from "@open-decision/type-classes";

export type EdgeResolver<TEdgePlugin extends TEdgePlugin> = (
  treeClient: TTreeClient | TReadOnlyTreeClient
) => (
  edge: TEdgePlugin
) => (
  context: InterpreterContext,
  event: EVALUATE_NODE_CONDITIONS
) =>
  | { state: "success"; target: string }
  | { state: "failure" }
  | { state: "error"; error: InterpreterError };

export type EdgePluginObject<TEdgePlugin extends TEdgePlugin = TEdgePlugin> = {
  plugin: EdgePlugin<TEdgePlugin>;
  resolver: EdgeResolver<TEdgePlugin>;
  type: string;
};
