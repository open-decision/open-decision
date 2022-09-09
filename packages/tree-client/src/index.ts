import {
  Tree,
  createTreeClient as createBaseTreeClient,
  Node,
  ODError,
} from "@open-decision/type-classes";
import { SelectPlugin } from "@open-decision/select-input-plugin";
import { ComparePlugin } from "@open-decision/compare-condition-plugin";
import { FreeTextPlugin } from "@open-decision/free-text-input-plugin";
import { z } from "zod";
import { DirectPlugin } from "@open-decision/direct-condition-plugin";

export const createTreeClient = <TTree extends Tree.TTree>(tree: TTree) => {
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
    throw new ODError({ code: "INVALID_DATA" });
  }

  const extendedTreeClient = createBaseTreeClient(
    tree as z.infer<typeof mergedTreeTypes>
  );

  return {
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
    input: { select },
    condition: { compare },
  };
};
