import {
  Edge,
  TReadOnlyTreeClient,
  TTreeClient,
} from "@open-decision/tree-type";
import { z } from "zod";
import {
  InterpreterContext,
  EVALUATE_NODE_CONDITIONS,
} from "@open-decision/interpreter";
import { InterpreterError } from "@open-decision/type-classes";
import { EdgePlugin } from "./EdgePlugin";

export type EdgeResolver<TEdge extends Edge.TEdge> = (
  treeClient: TTreeClient | TReadOnlyTreeClient
) => (
  edge: TEdge
) => (
  context: InterpreterContext,
  event: EVALUATE_NODE_CONDITIONS
) =>
  | { state: "success"; target: string }
  | { state: "failure" }
  | { state: "error"; error: InterpreterError };

export type EdgePluginObject<
  TType extends z.ZodType = any,
  TTypeName extends string = any,
  TEdge extends Edge.TEdge = any
> = {
  plugin: EdgePlugin<TType, TTypeName>;
  resolver: EdgeResolver<TEdge>;
  type: string;
};

export * from "./EdgePlugin";
