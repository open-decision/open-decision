import { pick } from "remeda";
import { ValuesType } from "utility-types";
import { Tree } from "../type-classes";

export const getInput =
  <TTree extends Tree.TTree>(tree: TTree) =>
  (inputId: string) =>
    tree.inputs?.[inputId] as ValuesType<TTree["inputs"]> | undefined;

export const getInputs =
  <TTree extends Tree.TTree>(tree: TTree) =>
  (inputIds: string[]): TTree["inputs"] | undefined => {
    if (!tree.inputs) return undefined;

    const inputs = pick(tree.inputs, inputIds);
    if (!inputs) return undefined;

    return inputs;
  };
