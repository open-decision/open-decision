import {
  Tree,
  createTreeClient as createBaseTreeClient,
  Node,
} from "@open-decision/type-classes";
import {
  selectPlugin,
  SingleSelectInput,
} from "@open-decision/select-input-plugin";
import { comparePlugin } from "@open-decision/compare-condition-plugin";
import { Overwrite } from "utility-types";
import { z } from "zod";

export const createTreeClient = (tree: Tree.TTree) => {
  const baseClient = createBaseTreeClient(tree);

  const select = selectPlugin(baseClient);
  const compare = comparePlugin(baseClient);

  return {
    ...baseClient,
    nodes: {
      ...baseClient.nodes,
      Type: Node.Type,
    },
    inputs: {
      ...baseClient.inputs,
      types: [select.type],
      Type: z.discriminatedUnion("type", [select.Type]),
    },
    conditions: { ...baseClient.conditions, Type: compare.Type },
    input: {
      select: {
        ...select,
        ui: SingleSelectInput(baseClient),
      },
    },
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

type ReturnCreateTreeClient = ReturnType<typeof createTreeClient>;

export type TTreeClient = {
  nodes: Overwrite<ReturnCreateTreeClient["nodes"]["Type"], TNodeType>;
  inputs: Overwrite<ReturnCreateTreeClient["inputs"]["Type"], TInputType>;
  conditions: Overwrite<
    ReturnCreateTreeClient["conditions"]["Type"],
    TConditionsType
  >;
  edges: ReturnCreateTreeClient["edges"];
} & Pick<ReturnCreateTreeClient, "condition" | "input">;
