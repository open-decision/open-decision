import { IInputPlugin, InputPlugin } from "../../helpers";
import { TAnswer } from "../../helpers/types";
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

export interface IMultiSelectInput extends IInputPlugin<typeof typeName> {
  answers: TAnswer[];
  required: boolean;
}

export class MultiSelectInputPlugin extends InputPlugin<IMultiSelectInput> {
  constructor() {
    super(typeName);
  }

  create = ({
    answers = [],
    required = false,
    label,
    ...data
  }: Partial<Omit<IMultiSelectInput, "id" | "type">>) => {
    return {
      id: `input_${crypto.randomUUID()}`,
      type: this.type,
      answers,
      required,
      label: label ? label : `Mehrfachauswahl ${answers.length + 1}`,
      ...data,
    } satisfies IMultiSelectInput;
  };

  createAnswer = createAnswer;

  addAnswer = addAnswer<IMultiSelectInput>();

  getAnswer = getAnswer<IMultiSelectInput>();

  updateAnswer = updateAnswer<IMultiSelectInput>();

  reorderAnswers = reorderAnswers<IMultiSelectInput>();

  deleteAnswer = deleteAnswer<IMultiSelectInput>();

  getInputsWithAnswers = getInputsWithAnswers<IMultiSelectInput>();

  updateRequired = updateRequired<IMultiSelectInput>();
}
