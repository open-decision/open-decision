import { IVariablePlugin, VariablePlugin } from "@open-decision/tree-type";
import { mapValues } from "remeda";

export const mapObjRecusively = (
  obj: Record<string, IVariablePlugin<string, `${string}_${string}`>>,
  fn: (obj: IVariablePlugin<string, `${string}_${string}`>) => any
) => {
  return mapValues(obj, (variable) => {
    if (Array.isArray(variable.value)) {
      const variableValues = variable.value.filter(
        (value) => value instanceof VariablePlugin
      );

      if (variableValues.length > 0) {
        return variableValues.map((value) => mapObjRecusively(value, fn));
      }

      return fn(variable);
    }

    if (typeof variable.value === "object") {
      return mapObjRecusively(variable.value, fn);
    }

    return fn(variable);
  });
};
