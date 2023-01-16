import { SelectInputRendererComponent } from "./ui/SelectInputRenderer";
import {
  SelectInputConfigurator,
  SelectInputPrimaryActionSlot,
} from "./ui/SelectInputEditor";
import { SelectInputPlugin } from "./SelectInputPlugin";
import { createInputPluginObject, ZInputPlugin } from "../../helpers";
import { z } from "zod";

export * from "./SelectInputPlugin";
export type { ISelectInput } from "./SelectInputPlugin";

const plugin = new SelectInputPlugin();
const ZSelectInput = ZInputPlugin.extend({
  type: z.literal(plugin.type),
  answers: z.array(z.object({ id: z.string().uuid(), value: z.string() })),
  required: z.boolean(),
});

export const SelectInputPluginObject = createInputPluginObject({
  plugin,
  type: plugin.type,
  BuilderComponent: {
    PrimaryActionSlot: SelectInputPrimaryActionSlot,
    InputConfigurator: SelectInputConfigurator,
  },
  RendererComponent: SelectInputRendererComponent,
  Type: ZSelectInput,
});
