import {
  Tree,
  createTreeClient as createBaseTreeClient,
  Node,
  ODValidationError,
} from "@open-decision/type-classes";
import { SelectPlugin } from "@open-decision/input-plugins-select";
import { ComparePlugin } from "@open-decision/condition-plugins-compare";
import { FreeTextPlugin } from "@open-decision/input-plugins-free-text";
import { z } from "zod";
import { DirectPlugin } from "@open-decision/condition-plugins-direct";
import { mergeDeepRight } from "ramda";

export const createTreeClient = <
  TExtendedTree extends Omit<Tree.TTree, "startNode" | "edge">
>(
  tree: Omit<Tree.TTree, "inputs" | "nodes" | "conditions"> & TExtendedTree
) => {
  const baseClient = createBaseTreeClient(tree);

  const select = new SelectPlugin(baseClient);
  const freeText = new FreeTextPlugin(baseClient);

  const compare = new ComparePlugin(baseClient);
  const direct = new DirectPlugin(baseClient);

  const mergedTreeTypes = Tree.Type.merge(
    z.object({
      inputs: z
        .record(
          z.discriminatedUnion("type", [select.MergedType, freeText.MergedType])
        )
        .optional(),
      conditions: z
        .record(
          z.discriminatedUnion("type", [compare.MergedType, direct.MergedType])
        )
        .optional(),
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
      Type: z.discriminatedUnion("type", [
        select.MergedType,
        freeText.MergedType,
      ]),
    },
    conditions: {
      ...extendedTreeClient.conditions,
      types: [compare.typeName, direct.typeName] as const,
      Type: z.discriminatedUnion("type", [
        compare.MergedType,
        direct.MergedType,
      ]),
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
