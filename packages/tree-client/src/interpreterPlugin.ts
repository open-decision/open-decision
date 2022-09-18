import { Resolver } from "@open-decision/interpreter";
import { resolver as directResolver } from "@open-decision/condition-plugins-direct";
import { resolver as compareResolver } from "@open-decision/condition-plugins-compare";
import { createTreeClient } from "./createTreeClient";
import {
  Tree,
  createTreeClient as createBaseTreeClient,
  ODProgrammerError,
  InterpreterError,
} from "@open-decision/type-classes";
import { z } from "zod";

export const interpreterPlugin: Resolver =
  (tree: Tree.TTree) => (context, event) => (callback) => {
    const treeClient = createTreeClient(tree);
    const baseTreeClient = createBaseTreeClient(tree);
    const conditions = treeClient.conditions.get.collection(event.conditionIds);

    const resolver = (
      condition: z.infer<typeof treeClient.conditions.Type>
    ) => {
      switch (condition.type) {
        case "direct":
          return directResolver(baseTreeClient)(condition);
        case "compare":
          return compareResolver(baseTreeClient)(condition);

        default:
          throw new ODProgrammerError({
            code: "UNKNOWN_CONDITION_TYPE_IN_RESOLVER",
            message: `${condition} is unknown`,
          });
      }
    };

    for (const conditionId in conditions) {
      const condition = conditions[conditionId];

      const conditionResolver = resolver(condition);

      const result = conditionResolver(context, event);

      if (result instanceof InterpreterError)
        return callback({ type: "INVALID_INTERPRETATION", error: result });

      callback({ type: "VALID_INTERPRETATION", target: result });
    }
  };
