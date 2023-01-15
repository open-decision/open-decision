import {
  MultiSelectInputPluginObject,
  SelectInputPluginObject,
  TextInputPluginObject,
  PlaceholderInputPluginObject,
  TMultiSelectInput,
  TTextInput,
  TSelectInput,
  TPlaceholderInput,
} from "@open-decision/plugins-node-helpers";
import { z } from "zod";

export const formNodeInputPlugins = {
  [MultiSelectInputPluginObject.type]: MultiSelectInputPluginObject,
  [TextInputPluginObject.type]: TextInputPluginObject,
  [SelectInputPluginObject.type]: SelectInputPluginObject,
  [PlaceholderInputPluginObject.type]: PlaceholderInputPluginObject,
};

export const FormNodeInputType = z.discriminatedUnion("type", [
  MultiSelectInputPluginObject.plugin.Type,
  TextInputPluginObject.plugin.Type,
  SelectInputPluginObject.plugin.Type,
  PlaceholderInputPluginObject.plugin.Type,
]);

export type TFormNodeInput =
  | TMultiSelectInput
  | TTextInput
  | TSelectInput
  | TPlaceholderInput;
