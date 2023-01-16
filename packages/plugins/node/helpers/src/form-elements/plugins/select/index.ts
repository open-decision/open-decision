import { SelectInputRendererComponent } from "./ui/SelectInputRenderer";
import {
  SelectInputConfigurator,
  SelectInputPrimaryActionSlot,
} from "./ui/SelectInputEditor";
import { SelectInputPlugin } from "./SelectInputPlugin";

export * from "./SelectInputPlugin";
export type { ISelectInput as ISelectInput } from "./SelectInputPlugin";

const plugin = new SelectInputPlugin();

export const SelectInputPluginObject = {
  plugin,
  type: plugin.type,
  BuilderComponent: {
    PrimaryActionSlot: SelectInputPrimaryActionSlot,
    InputConfigurator: SelectInputConfigurator,
  },
  RendererComponent: SelectInputRendererComponent,
};
