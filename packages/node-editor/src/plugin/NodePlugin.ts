import { Node, Plugin, TTreeClient } from "@open-decision/tree-type";
import { ODProgrammerError } from "@open-decision/type-classes";
import { z } from "zod";
import { pipe } from "remeda";

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

  private returnOnlyWhenType = (x: any) => {
    if (!this.isType(x)) return undefined;
    return x;
  };

  private returnOnlyWhenRecordOfType = (x: any) => {
    if (!this.isRecordOfType(x)) return undefined;
    return x;
  };

  get(nodeId: string) {
    return pipe(
      nodeId,
      this.treeClient.nodes.get.single,
      this.returnOnlyWhenType
    );
  }

  getN(nodeIds?: string[]) {
    return pipe(
      nodeIds
        ? this.treeClient.nodes.get.collection(nodeIds)
        : this.treeClient.nodes.get.all(),
      this.returnOnlyWhenRecordOfType
    );
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
