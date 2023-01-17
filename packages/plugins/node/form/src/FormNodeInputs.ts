import {
  MultiSelectInputPluginObject,
  SelectInputPluginObject,
  TextInputPluginObject,
  PlaceholderInputPluginObject,
  TMultiSelectInput,
  TTextInput,
  TSelectInput,
  TPlaceholderInput,
  createInputPluginGroup,
} from "@open-decision/plugins-node-helpers";

export const formNodeInputPlugins = createInputPluginGroup({
  [MultiSelectInputPluginObject.type]: MultiSelectInputPluginObject,
  [TextInputPluginObject.type]: TextInputPluginObject,
  [SelectInputPluginObject.type]: SelectInputPluginObject,
  [PlaceholderInputPluginObject.type]: PlaceholderInputPluginObject,
});

export type TFormNodeInput =
  | TMultiSelectInput
  | TTextInput
  | TSelectInput
  | TPlaceholderInput;
