import { BuilderTree } from "@open-decision/type-classes";
import { Draft } from "immer";
import { Context } from "./types";

export function addPatches(
  context: Draft<Context>,
  patches: BuilderTree.TPatch[],
  inversePatches: BuilderTree.TPatch[]
) {
  context.patches = [...patches, ...context.patches];
  context.undoRedoStack.unshift([patches, inversePatches]);
}
