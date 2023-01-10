import { z } from "zod";
import { Answer, IInputPlugin, InputPlugin } from "../../helpers";
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

export const typeName = "multi-select" as const;

export const DataType = z.object({
  answers: z.array(Answer),
  required: z.boolean(),
});

export type IMultiSelectInput = IInputPlugin<
  typeof typeName,
  z.infer<typeof DataType>
>;

export class MultiSelectInputPlugin extends InputPlugin<IMultiSelectInput> {
  constructor() {
    super(typeName, { answers: [], required: false });
  }

  createAnswer = createAnswer;

  addAnswer = addAnswer<IMultiSelectInput>();

  getAnswer = getAnswer<IMultiSelectInput>();

  updateAnswer = updateAnswer<IMultiSelectInput>();

  reorderAnswers = reorderAnswers<IMultiSelectInput>();

  deleteAnswer = deleteAnswer<IMultiSelectInput>();

  getInputsWithAnswers = getInputsWithAnswers<IMultiSelectInput>();
  updateRequired = updateRequired<IMultiSelectInput>();
}
