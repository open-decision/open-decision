import {
  EntityPlugin,
  TTreeClient,
  TReadOnlyTreeClient,
  EntityPluginBaseType,
} from "@open-decision/tree-type";
import { z } from "zod";
import {
  deleteInput,
  addInput,
  getInput,
  getInputs,
  updateInputLabel,
  updateInput,
} from "./utils/inputMethods";

export const InputPluginBaseType = <
  TType extends string,
  TDataType extends z.ZodType
>(
  type: TType,
  data: TDataType
) =>
  EntityPluginBaseType(type, data).extend({
    label: z.string().optional(),
    name: z.string().optional(),
  });

export type TInputPlugin<
  TTypeName extends string = string,
  TDataType = any
> = z.infer<
  ReturnType<typeof InputPluginBaseType<TTypeName, z.ZodType<TDataType>>>
>;

export abstract class InputPlugin<
  TType extends TInputPlugin = TInputPlugin
> extends EntityPlugin<TType> {
  pluginType = "pluginEntity" as const;
  create =
    (
      data: Omit<TType, "id" | "type" | "data"> & {
        data?: Partial<TType["data"]>;
      }
    ) =>
    (_treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return {
        id: crypto.randomUUID(),
        type: this.type,
        ...data,
        data: { ...this.defaultData, ...data?.data },
      } as TType;
    };

  addInput = addInput;
  update = updateInput;
  updateLabel = updateInputLabel<TType>();
  delete = deleteInput;
  getSingle = getInput<TType>();
  getCollection = getInputs<TType>();
  getAll = (treeClient: TTreeClient | TReadOnlyTreeClient) =>
    treeClient.pluginEntity.get.all("inputs");
  subscribeSingle = getInput<TType>();
  subscribeCollection = getInputs<TType>();
  subscribeAll = (treeClient: TTreeClient | TReadOnlyTreeClient) =>
    treeClient.pluginEntity.get.all("inputs");
}
