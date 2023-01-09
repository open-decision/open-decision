import { Plugin } from "@open-decision/tree-type";
import { z } from "zod";
import { BaseVariableType } from ".";

const mergeTypes = <
  TType extends z.ZodObject<{ value?: z.ZodType }>,
  TTypeName extends string
>(
  Type: TType,
  typeName: TTypeName
) =>
  BaseVariableType.extend({
    data: Type,
    type: z.literal(typeName),
  });

export class VariablePlugin<
  TType extends z.ZodObject<{ value?: z.ZodType }> = any,
  TTypeName extends string = any
> extends Plugin<
  TTypeName,
  TType,
  ReturnType<typeof mergeTypes<TType, TTypeName>>
> {
  declare type: TTypeName;
  pluginType = "variable" as const;

  constructor(Type: TType, typeName: TTypeName) {
    super(mergeTypes(Type, typeName));

    this.type = typeName;
  }

  getUserAnswer = (answers: Record<string, any>, sourceId: string) => {
    const answer = answers[sourceId];

    if (!answer) return undefined;

    const parsedAnswer = this.parse(answer);

    return parsedAnswer;
  };
}
