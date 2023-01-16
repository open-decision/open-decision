import { TTreeClient } from "@open-decision/tree-type";
import { IInputPlugin } from "../../InputPlugin";

/**
 * Always adds a new Input to the tree. There are no rules so this
 * will never fail.
 *
 * @param input to be added to the tree
 */
export const addInput = (input: IInputPlugin) => (treeClient: TTreeClient) => {
  treeClient.pluginEntity.add("inputs", input);
};
