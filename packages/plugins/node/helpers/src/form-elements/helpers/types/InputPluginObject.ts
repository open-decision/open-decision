import { IInputPlugin, InputPlugin } from "../InputPlugin";
import {
  InputConfiguratorProps,
  InputPrimaryActionSlotProps,
  InputRendererProps,
} from "./componentTypes";

export type InputPluginObject<
  TInputPlugin extends IInputPlugin = IInputPlugin
> = {
  plugin: InputPlugin<TInputPlugin>;
  type: TInputPlugin["type"];
  BuilderComponent: {
    InputConfigurator:
      | ((props: InputConfiguratorProps) => React.ReactNode)
      | null;
    PrimaryActionSlot:
      | ((props: InputPrimaryActionSlotProps) => React.ReactNode)
      | null;
  };
  RendererComponent: (props: InputRendererProps) => React.ReactNode;
};
