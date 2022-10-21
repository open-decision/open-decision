import { z } from "zod";
import { createSelectInputPlugin } from "./form-elements/select";
import { createTextInputPlugin } from "./form-elements/text";
import { TTreeClient } from "@open-decision/tree-type";

export const createInputPlugins = (treeClient: TTreeClient) => {
  const SelectInput = createSelectInputPlugin(treeClient);
  const TextInput = createTextInputPlugin(treeClient);

  const InputType = z.union([SelectInput.plugin.Type, TextInput.plugin.Type]);

  return [{ select: SelectInput, text: TextInput }, InputType] as const;
};
