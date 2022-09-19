import { Tree } from "../type-classes";
import * as Condition from "../type-classes/Condition";

/**
 * Always adds a new Condition to the tree. There are no rules so this
 * will never fail.
 *
 * @param condition to be added to the tree.
 */
export const addCondition =
  (tree: Tree.TTree) => (condition: Condition.TCondition) => {
    if (!tree.conditions) tree.conditions = {};

    tree.conditions[condition.id] = condition;
  };
