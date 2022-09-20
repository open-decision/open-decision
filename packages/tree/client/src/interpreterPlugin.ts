import { Resolver } from "@open-decision/interpreter";
import { resolver as directResolver } from "@open-decision/condition-plugins-direct";
import { resolver as compareResolver } from "@open-decision/condition-plugins-compare";
import { createTreeClient } from "./createTreeClient";
import {
  Tree,
  createTreeClient as createBaseTreeClient,
} from "@open-decision/tree-type";
import {
  ODProgrammerError,
  InterpreterError,
} from "@open-decision/type-classes";
import { z } from "zod";

export const interpreterPlugin: Resolver =
  (tree: Tree.TTree) => (context, event) => (callback) => {
    const treeClient = createTreeClient(tree);
    const baseTreeClient = createBaseTreeClient(tree);
    const validConditions = z
      .record(treeClient.conditions.Type)
      .safeParse(event.conditions);

    if (!validConditions.success)
      throw new ODProgrammerError({
        code: "INVALID_CONDITIONS",
        message:
          "The conditions provided to the interpreter are not valid for the configured plugins.",
      });

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

    for (const conditionId in validConditions.data) {
      const condition = validConditions.data[conditionId];

      const conditionResolver = resolver(condition);

      const result = conditionResolver(context, event);

      if (result instanceof InterpreterError)
        return callback({ type: "INVALID_INTERPRETATION", error: result });

      callback({ type: "VALID_INTERPRETATION", target: result });
    }
  };
