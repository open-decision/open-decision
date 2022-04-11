import { Tree } from "../type-classes";
import * as Condition from "../type-classes/Condition";
import { pipe } from "remeda";
import { createCondition } from "../creators";

/**
 * @description Always adds a new Condition to the tree. There are no rules so this
 * will never fail.
 *
 * @params - Accepts a partial or full Condition. A partial Condition is used to create a new Condition,
 * while a full Condition is directly added to the Tree.
 */
export const addCondition =
  (tree: Tree.TTree) => (condition: Condition.TCondition) => {
    if (!tree.conditions) tree.conditions = {};

    tree.conditions[condition.id] = condition;
  };

export const createAndAddCondition =
  (tree: Tree.TTree) => (condition: Parameters<typeof createCondition>[0]) =>
    pipe(condition, createCondition, addCondition(tree));
