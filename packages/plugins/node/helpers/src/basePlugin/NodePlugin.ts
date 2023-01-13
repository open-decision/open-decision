import {
  Node,
  Plugin,
  TReadOnlyTreeClient,
  TTreeClient,
} from "@open-decision/tree-type";
import { z } from "zod";
import { getNodeCollection } from "./utils/getNodeCollection";
import { getNodeSingle } from "./utils/getNodeSingle";

export type createFn<TType extends z.ZodType> = (
  data: Partial<Omit<z.infer<TType>, "id" | "type">>
) => (treeClient: TTreeClient) => z.infer<TType> & { type: string };

const mergeTypes = <TType extends z.ZodType, TTypeName extends string>(
  Type: TType,
  typeName: TTypeName
) => Node.Type.extend({ data: Type, type: z.literal(typeName) });

export abstract class NodePlugin<
  TType extends z.ZodType = any,
  TTypeName extends string = string
> extends Plugin<
  TTypeName,
  TType,
  ReturnType<typeof mergeTypes<TType, TTypeName>>
> {
  pluginType = "node" as const;
  isAddable: boolean;
  protected declare defaultData: z.infer<TType>;

  constructor(
    Type: TType,
    typeName: TTypeName,
    config: { isAddable: boolean } = { isAddable: true }
  ) {
    super(mergeTypes(Type, typeName));

    this.typeName = typeName;
    this.isAddable = config?.isAddable;
  }

  declare abstract create: createFn<typeof this.Type>;

  get get() {
    return {
      single:
        (nodeId: string) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
          getNodeSingle<z.infer<typeof this.Type>>(treeClient, nodeId),
      collection:
        (nodeIds?: string[]) =>
        (treeClient: TTreeClient | TReadOnlyTreeClient) =>
          getNodeCollection<Record<string, z.infer<typeof this.Type>>>(
            treeClient,
            nodeIds
          ),
    };
  }

  get subscribe() {
    return {
      single: (nodeId: string) => (treeClient: TReadOnlyTreeClient) =>
        getNodeSingle<z.infer<typeof this.Type>>(treeClient, nodeId),
      collection: (nodeIds: string[]) => (treeClient: TReadOnlyTreeClient) =>
        getNodeCollection<Record<string, z.infer<typeof this.Type>>>(
          treeClient,
          nodeIds
        ),
    };
  }
}
