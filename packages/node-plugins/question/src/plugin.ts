import { RichText } from "@open-decision/rich-text-editor";
import { TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import { NodePlugin } from "@open-decision/node-plugins-helpers";

export const typeName = "question" as const;

export const DataType = z.object({
  content: RichText.optional(),
  inputs: z.array(z.string()),
});

export class QuestionNodePlugin extends NodePlugin<
  typeof DataType,
  typeof typeName
> {
  constructor(treeClient: TTreeClient) {
    super(treeClient, DataType, typeName);
  }
}

export type TQuestionNode = z.infer<QuestionNodePlugin["Type"]>;
