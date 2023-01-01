import { TextInputEditor } from "./ui/TextInputEditor";
import { TextInputPlugin } from "./textPlugin";
import { TextInputRenderer } from "./ui/TextInputRenderer";

export * from "./textPlugin";

const plugin = new TextInputPlugin();
export const TextInputPluginObject = {
  plugin,
  type: plugin.typeName,
  BuilderComponent: {
    PrimaryActionSlot: null,
    InputConfigurator: TextInputEditor,
  },
  RendererComponent: TextInputRenderer,
};
