import {
  Tree,
  createTreeClient as createBaseTreeClient,
  Node,
} from "@open-decision/type-classes";
import { SelectPlugin } from "@open-decision/select-input-plugin";
import { ComparePlugin } from "@open-decision/compare-condition-plugin";
import { FreeTextPlugin } from "@open-decision/free-text-input-plugin";
import { z } from "zod";
import { DirectPlugin } from "@open-decision/direct-condition-plugin";

export const createTreeClient = (tree: Tree.TTree) => {
  const baseClient = createBaseTreeClient(tree);

  const select = new SelectPlugin(baseClient);
  const freeText = new FreeTextPlugin(baseClient);

  const compare = new ComparePlugin(baseClient);
  const direct = new DirectPlugin(baseClient);

  return {
    ...baseClient,
    nodes: {
      ...baseClient.nodes,
      Type: Node.Type,
    },
    inputs: {
      ...baseClient.inputs,
      types: [select.typeName],
      Type: z.discriminatedUnion("type", [
        select.MergedType,
        freeText.MergedType,
      ]),
    },
    conditions: {
      ...baseClient.conditions,
      types: [compare.typeName],
      Type: z.discriminatedUnion("type", [
        compare.MergedType,
        direct.MergedType,
      ]),
    },
    input: { select },
    condition: { compare },
  };
};

export type TInputType = z.infer<
  ReturnType<typeof createTreeClient>["inputs"]["Type"]
>;

export type TConditionsType = z.infer<
  ReturnType<typeof createTreeClient>["conditions"]["Type"]
>;

export type TNodeType = z.infer<
  ReturnType<typeof createTreeClient>["nodes"]["Type"]
>;

export type TTreeClient = ReturnType<typeof createTreeClient>;
