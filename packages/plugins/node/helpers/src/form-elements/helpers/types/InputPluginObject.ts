import { InputPlugin } from "../InputPlugin";
import {
  InputConfiguratorProps,
  InputPrimaryActionSlotProps,
  InputRendererProps,
} from "./componentTypes";

export type InputPluginObject = {
  plugin: InputPlugin;
  type: string;
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
