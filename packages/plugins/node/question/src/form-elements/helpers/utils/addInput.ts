import { TTreeClient } from "@open-decision/tree-type";
import { Input } from "..";

/**
 * Always adds a new Input to the tree. There are no rules so this
 * will never fail.
 *
 * @param input to be added to the tree
 */
export const addInput = (treeClient: TTreeClient) => (input: Input.TInput) => {
  treeClient.pluginEntity.add("inputs", input);
};
