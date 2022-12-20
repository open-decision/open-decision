import { MultiSelectInputRenderer } from "./ui/MultiSelectRenderer";
import {
  MultiSelectInputConfigurator,
  MultiSelectInputPrimaryActionSlot,
} from "./ui/MultiSelectEditor";
import { MultiSelectInputPlugin } from "./multiSelectPlugin";

export * from "./multiSelectPlugin";

export const createMultiSelectInputPlugin = () => {
  const plugin = new MultiSelectInputPlugin();

  return {
    plugin,
    type: plugin.typeName,
    BuilderComponent: {
      InputConfigurator: MultiSelectInputConfigurator,
      PrimaryActionSlot: MultiSelectInputPrimaryActionSlot,
    },
    RendererComponent: MultiSelectInputRenderer,
  };
};
