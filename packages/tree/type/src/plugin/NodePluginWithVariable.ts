import { ODError } from "@open-decision/type-classes";
import { z } from "zod";
import { TReadOnlyTreeClient, TTreeClient } from "../treeClient";
import { NodePlugin, TNodePlugin } from "./NodePlugin";

export abstract class NodePluginWithVariable<
  TType extends TNodePlugin = TNodePlugin,
  TVariable extends z.AnyZodObject = z.AnyZodObject
> extends NodePlugin<TType> {
  declare abstract VariableType: TVariable;

  getVariable = (nodeId: string, answers: Record<string, any>) => {
    const answer = answers[nodeId];

    if (!answer) return;

    const parsedAnswer = this.VariableType.safeParse(answer);

    if (!parsedAnswer.success)
      return new ODError({
        code: "VALIDATION_ERROR",
        message: `The data provided to the entity plugin is not of the correct Type.`,
        additionalData: { errors: parsedAnswer.error },
      });

    return parsedAnswer.data;
  };

  abstract createVariable: (
    nodeId: string,
    answer: any
  ) => (
    treeClient: TTreeClient | TReadOnlyTreeClient
  ) => z.infer<TVariable> | undefined;
}
