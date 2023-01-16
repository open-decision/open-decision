import {
  EntityPlugin,
  TTreeClient,
  TReadOnlyTreeClient,
  IEntityPluginBase,
} from "@open-decision/tree-type";
import {
  deleteInput,
  addInput,
  getInput,
  getInputs,
  updateInputLabel,
  updateInput,
} from "./utils/inputMethods";

export interface IInputPlugin<TTypeName extends string = string>
  extends IEntityPluginBase<TTypeName> {
  label?: string;
  name?: string;
}

export abstract class InputPlugin<
  TType extends IInputPlugin = IInputPlugin
> extends EntityPlugin<TType> {
  pluginType = "pluginEntity" as const;

  abstract create: (data: any) => (treeClient: TTreeClient) => TType;

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
