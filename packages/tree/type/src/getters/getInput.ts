import { ODProgrammerError } from "@open-decision/type-classes";
import { pick } from "remeda";
import { isEmpty } from "ramda";
import { Tree } from "../type-classes";

/**
 * Returns a single input from the tree.
 * @throws {ODProgrammerError} if the input does not exist
 */
export const getInput =
  <TTree extends Tree.TTree>(tree: TTree) =>
  (inputId: string) => {
    const input = tree.inputs?.[inputId];

    if (!input)
      throw new ODProgrammerError({
        code: "ENTITY_NOT_FOUND",
        message: `The input of id ${inputId} could not be found. Please check that the id is correct.
        Is the passed id actually a valid input id?`,
      });

    return input;
  };

export const getInputs =
  <TTree extends Tree.TTree>(tree: TTree) =>
  (inputIds: string[]): TTree["inputs"] | undefined => {
    if (!tree.inputs) return undefined;

    const inputs = pick(tree.inputs, inputIds);
    if (isEmpty(inputs)) return undefined;

    return inputs;
  };
