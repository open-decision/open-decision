import { EdgePlugin } from "@open-decision/plugins-edge-helpers";
import { TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";

export const typeName = "compare" as const;

export const DataType = z.object({
  condition: z.object({
    variableId: z.string().uuid(),
    valueIds: z.array(z.string().uuid()),
  }),
});

export class CompareEdgePlugin extends EdgePlugin<
  typeof DataType,
  typeof typeName
> {
  constructor() {
    super(DataType, typeName);

    this.defaultData = { condition: { variableId: "", valueIds: [] } };
  }

  addValue =
    (edgeId: string, newValue: string) => (treeClient: TTreeClient) => {
      const edge = this.get.single(edgeId)(treeClient);

      edge.data.condition?.valueIds.push(newValue);
    };

  updateValue =
    (edgeId: string, index: number, newValue: string) =>
    (treeClient: TTreeClient) => {
      const edge = this.get.single(edgeId)(treeClient);

      edge.data.condition.valueIds[index] = newValue;
    };

  removeValue =
    (edgeId: string, index: number) => (treeClient: TTreeClient) => {
      const edge = this.get.single(edgeId)(treeClient);

      edge.data.condition.valueIds.splice(index, 1);
    };

  // getEdgeByValueId = (valueId: string, nodeId?: string) => {
  //   const getEdgeByValueId = (
  //     treeClient: TTreeClient | TReadOnlyTreeClient
  //   ) => {
  //     let edges: Record<string, Edge.TEdge> | undefined;

  //     if (nodeId) {
  //       const nodeEdges = treeClient.edges.get.byNode(nodeId)?.source;
  //       if (!nodeEdges) return;
  //       edges = nodeEdges;
  //     } else {
  //       edges = treeClient.edges.get.all();
  //     }

  //     const edges = treeClient.edges.get.all();

  //     if (!edges || !edges) return undefined;

  //     const edge = Object.values(edges).find((edge) => {
  //       if (!edge.conditionId || !edges) return false;
  //       const condition = this.get.single(edge.conditionId)(treeClient);

  //       return condition?.data?.valueIds.includes(valueId);
  //     });

  //     return edge;
  //   };

  //   return getEdgeByValueId;
  // };

  // getConditionsByVariableId =
  //   (variableId: string) => (treeClient: TTreeClient | TReadOnlyTreeClient) => {
  //     const allConditions = this.get.collection()(treeClient);

  //     const conditions: Record<string, z.infer<typeof this.Type>> = {};

  //     for (const key in allConditions) {
  //       if (Object.prototype.hasOwnProperty.call(allConditions, key)) {
  //         const condition = allConditions[key];

  //         if (condition.data.variableId === variableId) {
  //           conditions[key] = condition;
  //         }
  //       }
  //     }

  //     if (isEmpty(conditions)) return undefined;

  //     return conditions;
  //   };

  // getConditionsByValueId =
  //   (variableId: string, valueId: string) =>
  //   (treeClient: TTreeClient | TReadOnlyTreeClient) => {
  //     const conditionsOfVariableId =
  //       this.getConditionsByVariableId(variableId)(treeClient);

  //     const conditions: Record<string, z.infer<typeof this.Type>> = {};

  //     for (const conditionId in conditionsOfVariableId) {
  //       const condition = conditionsOfVariableId[conditionId];

  //       if (condition.data.valueIds.includes(valueId)) {
  //         conditions[conditionId] = condition;
  //       }
  //     }

  //     return conditions;
  //   };
}

export type TCompareEdge = z.infer<CompareEdgePlugin["Type"]>;
