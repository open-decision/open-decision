import { z } from "zod";
import { SingleSelectVariablePlugin } from "@open-decision/plugins-variable-select";
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

export const typeName = "select" as const;

export const DataType = z.object({
  answers: z.array(Answer),
  label: z.string().optional(),
  required: z.boolean(),
});

export type TSelectInput = z.infer<SelectInputPlugin["Type"]>;
const SingleSelectVariable = new SingleSelectVariablePlugin();

export class SelectInputPlugin extends InputPlugin<
  typeof DataType,
  typeof typeName,
  typeof SingleSelectVariable
> {
  constructor() {
    super(DataType, typeName, SingleSelectVariable);
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

  getAnswer = getAnswer(this.Type);

  addAnswer = addAnswer(this.Type);

  updateAnswer = updateAnswer(this.Type);

  reorderAnswers = reorderAnswers(this.Type);

  deleteAnswer = deleteAnswer(this.Type);

  getInputsWithAnswers = getInputsWithAnswers(this.Type);
}
