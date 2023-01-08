import { z } from "zod";
import { MultiSelectVariablePlugin } from "@open-decision/plugins-variable-multi-select";
import { Answer, createFn, InputPlugin } from "../../helpers";
import {
  addAnswer,
  createAnswer,
  deleteAnswer,
  getAnswer,
  getInputsWithAnswers,
  reorderAnswers,
  updateAnswer,
} from "../../helpers/utils/answerMethods";

export const typeName = "multi-select" as const;

export const DataType = z.object({
  answers: z.array(Answer),
  required: z.boolean(),
});

const MultiSelectVariable = new MultiSelectVariablePlugin();

export class MultiSelectInputPlugin extends InputPlugin<
  typeof DataType,
  typeof typeName,
  typeof MultiSelectVariable
> {
  constructor() {
    super(DataType, typeName, MultiSelectVariable);

    this.defaultData = { answers: [], required: false };
  }

  create: createFn<typeof this.Type> = (data) => {
    const newInput = {
      id: crypto.randomUUID(),
      type: this.type,
      required: false,
      ...data,
      data: { ...this.defaultData, ...data?.data },
    };

    return this.parse(newInput);
  };

  createAnswer = createAnswer;

  addAnswer = addAnswer(this.Type);

  getAnswer = getAnswer(this.Type);

  updateAnswer = updateAnswer(this.Type);

  reorderAnswers = reorderAnswers(this.Type);

  deleteAnswer = deleteAnswer(this.Type);

  getInputsWithAnswers = getInputsWithAnswers(this.Type);
}

export type TMultiSelectInput = z.infer<MultiSelectInputPlugin["Type"]>;
