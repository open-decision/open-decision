import { InputPluginObject } from "@open-decision/input-plugins-helpers";
import { TTreeClient } from "packages/tree/type/src";
import { BuilderComponent } from "./builder";
import { DataType, TTextInput, TextInputPlugin } from "./plugin";
import { RendererComponent } from "./renderer";

export * from "./plugin";

export const createTextInputPlugin = (
  treeClient: TTreeClient
): InputPluginObject<typeof DataType, "text", TTextInput> => {
  return {
    plugin: new TextInputPlugin(treeClient),
    type: "text",
    BuilderComponent: {
      InputConfigurator: BuilderComponent,
    },
    RendererComponent,
  };
};
