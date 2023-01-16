import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";
import { IInputPlugin, InputPlugin, TAnswer } from "../../helpers";
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

export interface ISelectInput extends IInputPlugin<typeof typeName> {
  answers: TAnswer[];
  label?: string;
  required: boolean;
}

export class SelectInputPlugin extends InputPlugin<ISelectInput> {
  constructor() {
    super(typeName);
  }

  create =
    ({
      answers = [],
      required = false,
      ...data
    }: Partial<Omit<ISelectInput, "id" | "type">>) =>
    (_treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return {
        id: crypto.randomUUID(),
        type: this.type,
        answers,
        required,
        ...data,
      } satisfies ISelectInput;
    };

  createAnswer = createAnswer;

  getAnswer = getAnswer<ISelectInput>();

  addAnswer = addAnswer<ISelectInput>();

  updateAnswer = updateAnswer<ISelectInput>();

  reorderAnswers = reorderAnswers<ISelectInput>();

  deleteAnswer = deleteAnswer<ISelectInput>();

  getInputsWithAnswers = getInputsWithAnswers<ISelectInput>();

  updateRequired = updateRequired<ISelectInput>();
}
