import { TextInputEditor } from "./ui/TextInputEditor";
import { TextInputPlugin } from "./TextInputPlugin";
import { TextInputRenderer } from "./ui/TextInputRenderer";

export * from "./TextInputPlugin";

const plugin = new TextInputPlugin();
export const TextInputPluginObject = {
  plugin,
  type: plugin.type,
  BuilderComponent: {
    PrimaryActionSlot: null,
    InputConfigurator: TextInputEditor,
  },
  RendererComponent: TextInputRenderer,
};
