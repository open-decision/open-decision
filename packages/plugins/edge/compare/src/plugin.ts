import {
  EdgePlugin,
  EdgePluginBaseType,
  EntityPluginType,
} from "@open-decision/tree-type";
import { TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";

export const typeName = "compare" as const;

const DataType = z.object({
  condition: z.object({
    variableId: z.string().uuid(),
    valueIds: z.array(z.string().uuid()),
  }),
});

export const CompareEdgePluginType = EdgePluginBaseType(typeName, DataType);

export type TCompareEdge = EntityPluginType<typeof CompareEdgePluginType>;

export class CompareEdgePlugin extends EdgePlugin<TCompareEdge> {
  constructor() {
    super(typeName, CompareEdgePluginType, {
      condition: { variableId: "", valueIds: [] },
    });
  }

  addValue =
    (edgeId: string, newValue: string) => (treeClient: TTreeClient) => {
      const edge = this.getSingle(edgeId)(treeClient);

      if (edge instanceof Error) return;

      edge.data.condition?.valueIds.push(newValue);
    };

  updateValue =
    (edgeId: string, index: number, newValue: string) =>
    (treeClient: TTreeClient) => {
      const edge = this.getSingle(edgeId)(treeClient);

      if (edge instanceof Error) return;

      edge.data.condition.valueIds[index] = newValue;
    };

  removeValue =
    (edgeId: string, index: number) => (treeClient: TTreeClient) => {
      const edge = this.getSingle(edgeId)(treeClient);

      if (edge instanceof Error) return;

      edge.data.condition.valueIds.splice(index, 1);
    };
}
