import { ODProgrammerError } from "@open-decision/type-classes";
import { TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";

/**
 * Returns a single input from the tree.
 * @throws {ODProgrammerError} if the input does not exist
 */
export const getInput =
  <TType extends z.ZodTypeAny>(treeClient: TTreeClient, type: TType) =>
  (inputId: string) => {
    const input = treeClient.pluginEntity.get.single("inputs", inputId, type);

    if (!input)
      throw new ODProgrammerError({
        code: "ENTITY_NOT_FOUND",
        message: `The input of id ${inputId} could not be found. Please check that the id is correct. Is the passed id actually a valid input id?`,
      });

    return input;
  };
