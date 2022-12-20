import { TextInputEditor } from "./ui/TextInputEditor";
import { TextInputPlugin } from "./textPlugin";
import { TextInputRenderer } from "./ui/TextInputRenderer";

export * from "./textPlugin";

export const createTextInputPlugin = () => {
  const plugin = new TextInputPlugin();
  return {
    plugin,
    type: plugin.typeName,
    BuilderComponent: {
      PrimaryActionSlot: null,
      InputConfigurator: TextInputEditor,
    },
    RendererComponent: TextInputRenderer,
  };
};
