import { z } from "zod";

export abstract class NodeVariable<TVariableType extends z.ZodTypeAny> {
  Type: TVariableType;

  constructor(Type: TVariableType) {
    this.Type = Type;
  }

  abstract get: () => z.infer<TVariableType>;

  abstract create: () => z.infer<TVariableType>;
}
