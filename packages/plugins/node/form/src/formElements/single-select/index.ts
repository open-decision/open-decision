import { SingleSelectInputRenderer } from "./ui/SingleSelectInputRenderer";
import {
  SingleSelectInputConfigurator,
  SingleSelectInputPrimaryActionSlot,
} from "./ui/SingleSelectInputEditor";
import { SelectInputPlugin } from "./singleSelectPlugin";

export const createSelectInputPlugin = () => {
  const plugin = new SelectInputPlugin();

  return {
    plugin,
    type: plugin.typeName,
    BuilderComponent: {
      InputConfigurator: SingleSelectInputConfigurator,
      PrimaryActionSlot: SingleSelectInputPrimaryActionSlot,
    },
    RendererComponent: SingleSelectInputRenderer,
  };
};
