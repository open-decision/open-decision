import { TReadOnlyTreeClient, TTreeClient } from "@open-decision/tree-type";
import { createDefaultName } from "../../../utils/createDefaultName";
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
      name,
      ...data
    }: Partial<Omit<ISelectInput, "id" | "type">>) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return {
        id: `input_${crypto.randomUUID()}`,
        type: this.type,
        answers,
        required,
        name: name ? name : createDefaultName(treeClient),
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
