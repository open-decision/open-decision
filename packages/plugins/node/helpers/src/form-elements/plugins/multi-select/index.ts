import { MultiSelectInputRenderer } from "./ui/MultiSelectRenderer";
import {
  MultiSelectInputConfigurator,
  MultiSelectInputPrimaryActionSlot,
} from "./ui/MultiSelectEditor";
import { MultiSelectInputPlugin } from "./MultiSelectPlugin";

export * from "./MultiSelectPlugin";

const plugin = new MultiSelectInputPlugin();

export const MultiSelectInputPluginObject = {
  plugin,
  type: plugin.type,
  BuilderComponent: {
    InputConfigurator: MultiSelectInputConfigurator,
    PrimaryActionSlot: MultiSelectInputPrimaryActionSlot,
  },
  RendererComponent: MultiSelectInputRenderer,
};
