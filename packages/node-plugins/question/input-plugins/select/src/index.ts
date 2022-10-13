import { TTreeClient } from "@open-decision/tree-type";
import { InputPluginObject } from "@open-decision/input-plugins-helpers";
import { AnswersForm } from "./ui/AnswersForm";
import { SingleSelect, AddOptionButton } from "./ui/SingleSelect";
import { DataType, SelectInputPlugin, TSelectInput } from "./selectPlugin";

export * from "./selectPlugin";
export type { TSelectInput } from "./selectPlugin";

export const createSelectInputPlugin = (
  treeClient: TTreeClient
): InputPluginObject<typeof DataType, "select", TSelectInput> => {
  return {
    plugin: new SelectInputPlugin(treeClient),
    type: "select",
    BuilderComponent: {
      InputConfigurator: SingleSelect,
      PrimaryActionSlot: AddOptionButton,
    },
    RendererComponent: AnswersForm,
  };
};
