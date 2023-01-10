import {
  EntityPlugin,
  IEntityPluginBase,
  TTreeClient,
  TReadOnlyTreeClient,
} from "@open-decision/tree-type";
import {
  deleteInput,
  addInput,
  getInput,
  getInputs,
  updateInputLabel,
} from "./utils/inputMethods";

export interface IInputPlugin<
  TTypeName extends string = string,
  TDataType = any
> extends IEntityPluginBase<TTypeName, TDataType> {
  label?: string;
  name?: string;
}

export abstract class InputPlugin<
  TType extends IInputPlugin = IInputPlugin
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
