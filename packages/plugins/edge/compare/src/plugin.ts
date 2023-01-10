import { EdgePlugin, IEdgePlugin } from "@open-decision/tree-type";
import { TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";

export const typeName = "compare" as const;

export const DataType = z.object({
  condition: z.object({
    variableId: z.string().uuid(),
    valueIds: z.array(z.string().uuid()),
  }),
});

export type ICompareEdge = IEdgePlugin<
  typeof typeName,
  z.infer<typeof DataType>
>;

export class CompareEdgePlugin extends EdgePlugin<ICompareEdge> {
  constructor() {
    super(typeName, { condition: { variableId: "", valueIds: [] } });
  }

  addValue =
    (edgeId: string, newValue: string) => (treeClient: TTreeClient) => {
      const edge = this.getSingle(edgeId)(treeClient);

      edge.data.condition?.valueIds.push(newValue);
    };

  updateValue =
    (edgeId: string, index: number, newValue: string) =>
    (treeClient: TTreeClient) => {
      const edge = this.getSingle(edgeId)(treeClient);

      edge.data.condition.valueIds[index] = newValue;
    };

  removeValue =
    (edgeId: string, index: number) => (treeClient: TTreeClient) => {
      const edge = this.getSingle(edgeId)(treeClient);

      edge.data.condition.valueIds.splice(index, 1);
    };
}
