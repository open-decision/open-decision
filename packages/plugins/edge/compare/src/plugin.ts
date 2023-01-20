import { TEdgeId } from "@open-decision/tree-id";
import {
  EdgePlugin,
  IEdge,
  TReadOnlyTreeClient,
} from "@open-decision/tree-type";
import { TTreeClient } from "@open-decision/tree-type";
import { ODError } from "@open-decision/type-classes";

export const typeName = "compare" as const;

export interface ICompareEdge extends IEdge<typeof typeName> {
  condition: {
    variableId: string;
    valueIds: string[];
  };
}

export class CompareEdgePlugin extends EdgePlugin<ICompareEdge> {
  constructor() {
    super(typeName);
  }

  create =
    (data: Omit<ICompareEdge, "id" | "type">) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const newEdge = treeClient.edges.create<ICompareEdge>({
        type: this.type,
        ...data,
      });

      if (newEdge instanceof ODError) {
        return newEdge;
      }

      return newEdge satisfies ICompareEdge;
    };

  addValue =
    (edgeId: TEdgeId, newValue: string) => (treeClient: TTreeClient) => {
      const edge = this.getSingle(edgeId)(treeClient);

      if (!edge) return;

      edge.condition?.valueIds.push(newValue);
    };

  updateValue =
    (edgeId: TEdgeId, index: number, newValue: string) =>
    (treeClient: TTreeClient) => {
      const edge = this.getSingle(edgeId)(treeClient);

      if (!edge) return;

      edge.condition.valueIds[index] = newValue;
    };

  removeValue =
    (edgeId: TEdgeId, index: number) => (treeClient: TTreeClient) => {
      const edge = this.getSingle(edgeId)(treeClient);

      if (!edge) return;

      edge.condition.valueIds.splice(index, 1);
    };
}
