import { InputPlugin } from "../InputPlugin";
import {
  InputComponentProps,
  InputPrimaryActionSlotProps,
  RendererComponentProps,
} from "./componentTypes";

export type InputPluginObject = {
  plugin: InputPlugin;
  type: string;
  BuilderComponent: {
    InputConfigurator: ((props: InputComponentProps) => React.ReactNode) | null;
    PrimaryActionSlot:
      | ((props: InputPrimaryActionSlotProps) => React.ReactNode)
      | null;
  };
  RendererComponent: (props: RendererComponentProps) => React.ReactNode;
};
