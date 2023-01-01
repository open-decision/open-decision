import { PlaceholderInputRenderer } from "./ui/PlaceholderRenderer";
import { PlaceholderInputPlugin } from "./placeholderInputPlugin";

export * from "./placeholderInputPlugin";

const plugin = new PlaceholderInputPlugin();

export const PlaceholderInputPluginObject = {
  plugin,
  type: plugin.typeName,
  BuilderComponent: {
    InputConfigurator: null,
    PrimaryActionSlot: null,
  },
  RendererComponent: PlaceholderInputRenderer,
};
