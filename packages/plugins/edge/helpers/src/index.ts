import {
  EdgePlugin,
  TReadOnlyTreeClient,
  TTreeClient,
  TEdgePlugin,
} from "@open-decision/tree-type";
import {
  InterpreterContext,
  EVALUATE_NODE_CONDITIONS,
} from "@open-decision/interpreter";
import { InterpreterError } from "@open-decision/type-classes";

export type EdgeResolver<TType extends TEdgePlugin> = (
  treeClient: TTreeClient | TReadOnlyTreeClient
) => (
  edge: TType
) => (
  context: InterpreterContext,
  event: EVALUATE_NODE_CONDITIONS
) =>
  | { state: "success"; target: string }
  | { state: "failure" }
  | { state: "error"; error: InterpreterError };

export type EdgePluginObject<TType extends TEdgePlugin = TEdgePlugin> = {
  plugin: EdgePlugin<TType>;
  resolver: EdgeResolver<TType>;
  type: string;
};
