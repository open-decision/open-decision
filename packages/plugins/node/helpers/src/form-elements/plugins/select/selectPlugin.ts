import { z } from "zod";
import { Answer, IInputPlugin, InputPlugin, TAnswer } from "../../helpers";
import {
  addAnswer,
  createAnswer,
  deleteAnswer,
  getAnswer,
  getInputsWithAnswers,
  reorderAnswers,
  updateAnswer,
} from "../../helpers/utils/answerMethods";
import { updateRequired } from "../../helpers/utils/inputMethods";

export const typeName = "select" as const;

export const DataType = z.object({
  answers: z.array(Answer),
  label: z.string().optional(),
  required: z.boolean(),
});

export type ISelectInput = IInputPlugin<
  typeof typeName,
  { answers: TAnswer[]; required: boolean }
>;

export class SelectInputPlugin extends InputPlugin<ISelectInput> {
  constructor() {
    super("select", { answers: [], required: false });
  }

  createAnswer = createAnswer;

  getAnswer = getAnswer<ISelectInput>();

  addAnswer = addAnswer<ISelectInput>();

  updateAnswer = updateAnswer<ISelectInput>();

  reorderAnswers = reorderAnswers<ISelectInput>();

  deleteAnswer = deleteAnswer<ISelectInput>();

  getInputsWithAnswers = getInputsWithAnswers<ISelectInput>();
  updateRequired = updateRequired<ISelectInput>();
}
