import { PlaceholderInputPlugin } from "./PlaceholderInputPlugin";
import { PlaceholderInputRenderer } from "./ui/PlaceholderRenderer";

export * from "./PlaceholderInputPlugin";

const plugin = new PlaceholderInputPlugin();

export const PlaceholderInputPluginObject = {
  plugin,
  type: plugin.type,
  BuilderComponent: {
    InputConfigurator: null,
    PrimaryActionSlot: null,
  },
  RendererComponent: PlaceholderInputRenderer,
};
