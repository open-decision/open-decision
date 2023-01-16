import {
  EdgePlugin,
  IEdgePlugin,
  TReadOnlyTreeClient,
  TTreeClient,
} from "@open-decision/tree-type";
import { ODError } from "@open-decision/type-classes";

export const typeName = "direct" as const;

export type IDirectEdge = IEdgePlugin<typeof typeName>;

export class DirectEdgePlugin extends EdgePlugin<IDirectEdge> {
  constructor() {
    super(typeName);
  }

  create =
    (data: Omit<IDirectEdge, "id" | "type">) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      const newEdge = treeClient.edges.create<IDirectEdge>({
        type: this.type,
        ...data,
      });

      if (newEdge instanceof ODError) {
        return newEdge;
      }

      return newEdge satisfies IDirectEdge;
    };
}
