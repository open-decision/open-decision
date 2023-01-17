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

export const typeName = "multi-select" as const;

export interface IMultiSelectInput extends IInputPlugin<typeof typeName> {
  answers: TAnswer[];
  required: boolean;
}

export class MultiSelectInputPlugin extends InputPlugin<IMultiSelectInput> {
  constructor() {
    super(typeName);
  }

  create =
    ({
      answers = [],
      required = false,
      name,
      ...data
    }: Partial<Omit<IMultiSelectInput, "id" | "type">>) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return {
        id: `input_${crypto.randomUUID()}`,
        type: this.type,
        answers,
        required,
        name: name ? name : createDefaultName(treeClient),
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
