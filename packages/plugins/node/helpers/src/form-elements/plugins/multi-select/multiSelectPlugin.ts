import { EntityPluginType } from "@open-decision/tree-type";
import { z } from "zod";
import { Answer, InputPlugin, InputPluginBaseType } from "../../helpers";
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

const DataType = z.object({
  answers: z.array(Answer),
  required: z.boolean(),
});

export const MultiSelectInputPluginType = InputPluginBaseType(
  typeName,
  DataType
);

export type TMultiSelectInput = EntityPluginType<
  typeof MultiSelectInputPluginType
>;

export class MultiSelectInputPlugin extends InputPlugin<TMultiSelectInput> {
  constructor() {
    super(typeName, MultiSelectInputPluginType, {
      answers: [],
      required: false,
    });
  }

  createAnswer = createAnswer;

  addAnswer = addAnswer<TMultiSelectInput>();

  getAnswer = getAnswer<TMultiSelectInput>();

  updateAnswer = updateAnswer<TMultiSelectInput>();

  reorderAnswers = reorderAnswers<TMultiSelectInput>();

  deleteAnswer = deleteAnswer<TMultiSelectInput>();

  getInputsWithAnswers = getInputsWithAnswers<TMultiSelectInput>();
  updateRequired = updateRequired<TMultiSelectInput>();
}
