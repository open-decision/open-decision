import {
  Edge,
  Plugin,
  TReadOnlyTreeClient,
  TTreeClient,
} from "@open-decision/tree-type";
import { ODError } from "@open-decision/type-classes";
import { merge } from "remeda";
import { z } from "zod";
import { getEdgeCollection } from "./utils/getEdgeCollection";
import { getEdgeSingle } from "./utils/getEdgeSingle";

const mergeTypes = <TType extends z.ZodType, TTypeName extends string>(
  Type: TType,
  typeName: TTypeName
) =>
  Edge.Type.extend({
    type: z.literal(typeName),
    data: Type,
  });

export abstract class EdgePlugin<
  TType extends z.ZodType = any,
  TTypeName extends string = any
> extends Plugin<
  TTypeName,
  TType,
  ReturnType<typeof mergeTypes<TType, TTypeName>>
> {
  pluginType = "edge" as const;
  protected declare defaultData: any;

  constructor(Type: TType, typeName: TTypeName) {
    super(mergeTypes(Type, typeName));
  }

  create =
    (
      data: Partial<Omit<z.infer<typeof this.Type>, "id" | "type">> &
        Required<Pick<z.infer<typeof this.Type>, "source">>
    ) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const newEdge = treeClient.edges.create(
        merge(
          {
            type: this.type,
            data: this.defaultData,
          },
          data
        )
      );

      return newEdge instanceof ODError ? newEdge : this.Type.parse(newEdge);
    };

  get get() {
    return {
      single:
        (edgeId: string) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
          getEdgeSingle<z.infer<typeof this.Type>>(treeClient, edgeId),
      collection:
        (edgeIds?: string[]) =>
        (treeClient: TTreeClient | TReadOnlyTreeClient) =>
          getEdgeCollection<Record<string, z.infer<typeof this.Type>>>(
            treeClient,
            edgeIds
          ),
      byNode:
        (nodeId: string) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
          treeClient.edges.get.byNode(nodeId, this.type, this.Type),
    };
  }

  get subscribe() {
    return {
      single: (edgeId: string) => (treeClient: TReadOnlyTreeClient) =>
        getEdgeSingle<z.infer<typeof this.Type>>(treeClient, edgeId),
      collection: (edgeIds: string[]) => (treeClient: TReadOnlyTreeClient) =>
        getEdgeCollection<Record<string, z.infer<typeof this.Type>>>(
          treeClient,
          edgeIds
        ),
    };
  }
}
