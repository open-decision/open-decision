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

export const typeName = "select" as const;

const DataType = z.object({
  answers: z.array(Answer),
  label: z.string().optional(),
  required: z.boolean(),
});

export const SelectInputPluginType = InputPluginBaseType(typeName, DataType);

export type TSelectInput = EntityPluginType<typeof SelectInputPluginType>;

export class SelectInputPlugin extends InputPlugin<TSelectInput> {
  constructor() {
    super("select", SelectInputPluginType, { answers: [], required: false });
  }

  createAnswer = createAnswer;

  getAnswer = getAnswer<TSelectInput>();

  addAnswer = addAnswer<TSelectInput>();

  updateAnswer = updateAnswer<TSelectInput>();

  reorderAnswers = reorderAnswers<TSelectInput>();

  deleteAnswer = deleteAnswer<TSelectInput>();

  getInputsWithAnswers = getInputsWithAnswers<TSelectInput>();

  updateRequired = updateRequired<TSelectInput>();
}
