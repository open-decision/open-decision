import { TTreeClient } from "@open-decision/tree-type";
import { TInputId } from "../../InputPlugin";
import { TAnswer } from "../../types";
import { InputWithAnswers } from "./sharedTypes";

export const reorderAnswers =
  <TType extends InputWithAnswers>() =>
  (inputId: TInputId, newAnswers: TAnswer[]) =>
  (treeClient: TTreeClient) => {
    const input = treeClient.pluginEntity.get.single<TType>("inputs", inputId);

    if (!input) return;

    input.answers = newAnswers;
  };
