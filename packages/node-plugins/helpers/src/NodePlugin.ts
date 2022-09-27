import { Node, Plugin, TTreeClient } from "@open-decision/tree-type";
import { ODProgrammerError } from "@open-decision/type-classes";
import { z } from "zod";

const mergeTypes = <TType extends z.ZodType, TTypeName extends string>(
  Type: TType,
  typeName: TTypeName
) => Node.Type.extend({ data: Type, type: z.literal(typeName) });

export class NodePlugin<
  TType extends z.ZodType,
  TTypeName extends string
> extends Plugin<
  TTypeName,
  TType,
  ReturnType<typeof mergeTypes<TType, TTypeName>>
> {
  declare treeClient: TTreeClient;
  declare typeName: TTypeName;
  pluginType = "node" as const;

  constructor(treeClient: TTreeClient, Type: TType, typeName: TTypeName) {
    super(treeClient, mergeTypes(Type, typeName));

    this.typeName = typeName;
  }

  create(
    data: Omit<Node.TNode, "data" | "type" | "id">,
    pluginData: z.infer<TType>
  ) {
    const newNode = this.treeClient.nodes.create.node({
      data: pluginData,
      type: this.typeName,
      ...data,
    });

    const parsedNode = this.Type.safeParse(newNode);

    if (!parsedNode.success) {
      throw new ODProgrammerError({
        code: "INVALID_ENTITY_CREATION",
        message:
          "The condition could not be created. Please check that the data is correct.",
      });
    }

    return parsedNode.data;
  }
}
