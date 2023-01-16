import { TTreeClient } from "@open-decision/tree-type";
import { TAnswer } from "../../types";
import { InputWithAnswers } from "./sharedTypes";

export const reorderAnswers =
  <TType extends InputWithAnswers>() =>
  (inputId: string, newAnswers: TAnswer[]) =>
  (treeClient: TTreeClient) => {
    const input = treeClient.pluginEntity.get.single<TType>("inputs", inputId);

    if (input instanceof Error) return;

    input.answers = newAnswers;
  };
