import { MultiSelectInputRenderer } from "./ui/MultiSelectRenderer";
import {
  MultiSelectInputConfigurator,
  MultiSelectInputPrimaryActionSlot,
} from "./ui/MultiSelectEditor";
import { MultiSelectInputPlugin } from "./MultiSelectPlugin";
import { createInputPluginObject, ZInputPlugin } from "../../helpers";
import { z } from "zod";

export * from "./MultiSelectPlugin";

const plugin = new MultiSelectInputPlugin();

const ZMultiSelectInput = ZInputPlugin.extend({
  type: z.literal(plugin.type),
  answers: z.array(z.object({ id: z.string().uuid(), value: z.string() })),
  required: z.boolean(),
});

export const MultiSelectInputPluginObject = createInputPluginObject({
  plugin,
  type: plugin.type,
  BuilderComponent: {
    InputConfigurator: MultiSelectInputConfigurator,
    PrimaryActionSlot: MultiSelectInputPrimaryActionSlot,
  },
  RendererComponent: MultiSelectInputRenderer,
  Type: ZMultiSelectInput,
});
