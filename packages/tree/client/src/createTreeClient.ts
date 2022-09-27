import { ODValidationError } from "@open-decision/type-classes";
import {
  Tree,
  createTreeClient as createBaseTreeClient,
  Node,
} from "@open-decision/tree-type";
import { SelectInputPlugin } from "@open-decision/input-plugins-select";
import { CompareConditionPlugin } from "@open-decision/condition-plugins-compare";
import { FreeTextInputPlugin } from "@open-decision/input-plugins-free-text";
import { z } from "zod";
import { DirectConditionPlugin } from "@open-decision/condition-plugins-direct";
import { QuestionNodePlugin } from "@open-decision/node-plugins-question";
import { mergeDeepRight } from "ramda";

export const createTreeClient = <
  TExtendedTree extends Omit<Tree.TTree, "startNode" | "edge">
>(
  tree: Omit<Tree.TTree, "inputs" | "nodes" | "conditions"> & TExtendedTree
) => {
  const baseClient = createBaseTreeClient(tree);

  const select = new SelectInputPlugin(baseClient);
  const freeText = new FreeTextInputPlugin(baseClient);

  const compare = new CompareConditionPlugin(baseClient);
  const direct = new DirectConditionPlugin(baseClient);

  const question = new QuestionNodePlugin(baseClient);

  const mergedTreeTypes = Tree.Type.merge(
    z.object({
      inputs: z
        .record(z.discriminatedUnion("type", [select.Type, freeText.Type]))
        .optional(),
      conditions: z
        .record(z.discriminatedUnion("type", [compare.Type, direct.Type]))
        .optional(),
      nodes: z.record(question.Type).optional(),
    })
  );

  const extendedTree = mergedTreeTypes.safeParse(tree);

  if (!extendedTree.success) {
    console.error(extendedTree.error);
    throw new ODValidationError({
      code: "INVALID_DATA",
      zodError: extendedTree.error,
    });
  }

  const extendedTreeClient = createBaseTreeClient(
    tree as z.infer<typeof mergedTreeTypes>
  );

  const treeClientWithTypes = {
    Type: mergedTreeTypes,
    ...extendedTreeClient,
    nodes: {
      ...extendedTreeClient.nodes,
      Type: Node.Type,
    },
    inputs: {
      ...extendedTreeClient.inputs,
      types: [select.typeName, freeText.typeName] as const,
      Type: z.discriminatedUnion("type", [select.Type, freeText.Type]),
    },
    conditions: {
      ...extendedTreeClient.conditions,
      types: [compare.typeName, direct.typeName] as const,
      Type: z.discriminatedUnion("type", [compare.Type, direct.Type]),
    },
    input: { select, freeText },
    condition: { compare, direct },
  };

  return mergeDeepRight(treeClientWithTypes, {
    inputs: {
      update: {
        type: (
          inputId: string,
          newInput: Omit<z.infer<typeof treeClientWithTypes.inputs.Type>, "id">
        ) => {
          treeClientWithTypes.inputs.update(inputId, newInput);
        },
      },
    },
  });
};

export type TTreeClient = ReturnType<typeof createTreeClient<Tree.TTree>>;
export type TTree = z.infer<TTreeClient["Type"]>;

export type TCreateTreeClient<
  TTree extends Omit<Tree.TTree, "startNode" | "edge">
> = ReturnType<typeof createTreeClient<TTree>>;
