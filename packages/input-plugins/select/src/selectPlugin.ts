import { Type, type } from "./types";

import { addAnswer } from "./functions/addAnswer";
import { get, getInputsWithAnswers } from "./functions/get";
import { create } from "./functions/create";
import { createTargetNode } from "./functions/createTargetNode";
import { updateTarget } from "./functions/updateTarget";
import { TTreeClient } from "@open-decision/type-classes";
import { comparePlugin } from "@open-decision/compare-condition-plugin";
import { reorderAnswers } from "./functions/reorderAnswers";
import { updateAnswer } from "./functions/updateAnswer";
import { getAnswer } from "./functions/getAnswer";
import { deleteAnswer } from "./functions/deleteAnswer";

export function selectPlugin(treeClient: TTreeClient) {
  return {
    input: {
      select: {
        type,
        Type,
        get: get(treeClient),
        create: create(treeClient),
        createTargetNode: createTargetNode(treeClient),
        updateTarget: updateTarget(treeClient),
        addAnswer: addAnswer(treeClient),
        reorderAnswers: (inputId: string) => {
          const input = get(treeClient)(inputId);
          if (input instanceof Error) return;

          return reorderAnswers(input);
        },
        updateAnswer: updateAnswer(treeClient),
        getAnswer,
        deleteAnswer: deleteAnswer(treeClient),
        getInputsWithAnswers: getInputsWithAnswers,
      },
    },
    condition: { compare: comparePlugin(treeClient) },
  };
}
