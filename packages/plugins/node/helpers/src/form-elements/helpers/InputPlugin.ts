import {
  EntityPlugin,
  TTreeClient,
  TReadOnlyTreeClient,
  IEntityBase,
  ZEntityPluginBase,
} from "@open-decision/tree-type";
import { keys, mapValues } from "remeda";
import { z } from "zod";
import {
  InputConfigurator,
  InputPrimaryActionSlot,
  InputRenderer,
} from "./types";
import {
  deleteInput,
  addInput,
  getInput,
  getInputs,
  updateInput,
  updateInputLabel,
} from "./utils/inputMethods";

export const ZInputId = z.custom<TInputId>(
  (value) => typeof value === "string" && value.includes("inputs")
);

export const ZInputPlugin = ZEntityPluginBase.extend({
  id: ZInputId,
  label: z.string(),
});

export type InputPluginObject<TType extends IInputPlugin = IInputPlugin> = {
  plugin: InputPlugin<TType>;
  type: TType["type"];
  BuilderComponent: {
    PrimaryActionSlot?: InputPrimaryActionSlot;
    InputConfigurator?: InputConfigurator;
  };
  RendererComponent?: InputRenderer;
  Type: z.ZodType<TType>;
};

export type TInputId = `input_${string}`;

export interface IInputPlugin<TTypeName extends string = string>
  extends IEntityBase<TTypeName> {
  id: TInputId;
  label: string;
}

export abstract class InputPlugin<
  TType extends IInputPlugin = IInputPlugin
> extends EntityPlugin<TType> {
  pluginType = "pluginEntity" as const;

  abstract create: (data: any) => TType;

  addInput = addInput;
  update = updateInput;
  delete = deleteInput;
  getSingle = getInput<TType>();
  updateLabel = updateInputLabel<TType>();
  getCollection = getInputs<TType>();
  getAll = (treeClient: TTreeClient | TReadOnlyTreeClient) =>
    treeClient.pluginEntity.get.all<TType>("inputs");
  subscribeSingle = getInput<TType>();
  subscribeCollection = getInputs<TType>();
  subscribeAll = (treeClient: TTreeClient | TReadOnlyTreeClient) =>
    treeClient.pluginEntity.get.all<TType>("inputs");
}

export const createInputPluginObject = <
  TType extends IInputPlugin = IInputPlugin
>(
  pluginObj: InputPluginObject<TType>
) => {
  return pluginObj satisfies InputPluginObject<TType>;
};

export const createInputPluginGroup = <
  TInputPlugins extends Record<string, InputPluginObject>
>(
  inputPlugins: TInputPlugins
) => {
  const plugins = mapValues(inputPlugins, (plugin) => plugin.plugin);
  const Builder = mapValues(inputPlugins, (plugin) => plugin.BuilderComponent);
  const Renderer = mapValues(
    inputPlugins,
    (plugin) => plugin.RendererComponent
  );
  const types = keys.strict(inputPlugins);
  const TypeArray = Object.values(inputPlugins).map((plugin) => plugin.Type);
  const Type =
    TypeArray.length > 1
      ? z.union([TypeArray[0], TypeArray[1], ...TypeArray])
      : TypeArray[0];

  return {
    types,
    pluginObjects: inputPlugins,
    plugins,
    Builder,
    Renderer,
    Type,
  };
};
