import { TTreeClient } from "@open-decision/tree-type";
import { BuilderComponent } from "./ui/builder";
import { TextInputPlugin } from "./textPlugin";
import { RendererComponent } from "./ui/renderer";

export * from "./textPlugin";

export const createTextInputPlugin = (treeClient: TTreeClient) => {
  return {
    plugin: new TextInputPlugin(treeClient),
    type: "text",
    BuilderComponent: {
      PrimaryActionSlot: undefined,
      InputConfigurator: BuilderComponent,
    },
    RendererComponent,
  };
};
