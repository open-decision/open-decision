import { TTreeClient } from "@open-decision/tree-type";
import { AnswersForm } from "./ui/AnswersForm";
import { SingleSelect, AddOptionButton } from "./ui/SingleSelect";
import { SelectInputPlugin } from "./selectPlugin";

export * from "./selectPlugin";
export type { TSelectInput } from "./selectPlugin";

export const createSelectInputPlugin = (treeClient: TTreeClient) => {
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
