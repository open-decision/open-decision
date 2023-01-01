import { TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import { TextVariablePlugin } from "@open-decision/plugins-variable-text";
import { InputPlugin } from "../../helpers";

export const typeName = "text" as const;

export const DataType = z
  .object({ required: z.boolean() })
  .default({ required: false });

export type TTextInput = z.infer<TextInputPlugin["Type"]>;
const TextVariable = new TextVariablePlugin();

export class TextInputPlugin extends InputPlugin<
  typeof DataType,
  typeof typeName,
  typeof TextVariable
> {
  constructor() {
    super(DataType, typeName, TextVariable);

    this.defaultData = { required: false };
  }

  updateTarget =
    ({
      nodeId,
      newItem,
      edgeId,
    }: {
      nodeId: string;
      newItem: string;
      edgeId?: string;
    }) =>
    (treeClient: TTreeClient) => {
      const edge = edgeId ? treeClient.edges.get.single(edgeId) : undefined;

      if (edge instanceof Error) throw edge;

      if (!edge?.target && newItem) {
        const newEdge = treeClient.edges.create({
          source: nodeId,
          target: newItem,
        });

        if (newEdge instanceof Error) return;

        treeClient.edges.add(newEdge);
      }

      if (edge?.target && newItem)
        treeClient.edges.connect.toTargetNode(edge.id, newItem);
    };
}
