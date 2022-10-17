import { Node, Plugin, TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import { pipe } from "remeda";
import { ODProgrammerError } from "@open-decision/type-classes";

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

  safeParse(node: unknown) {
    const parsedNode = this.Type.safeParse(node);

    if (!parsedNode.success) {
      console.error(parsedNode.error);
      throw new ODProgrammerError({
        code: "INVALID_ENTITY_CREATION",
        message:
          "The node could not be created. Please check that the data is correct.",
      });
    }

    return parsedNode.data;
  }
}
