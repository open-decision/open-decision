import { TextInputEditor } from "./ui/TextInputEditor";
import { TextInputPlugin } from "./TextInputPlugin";
import { TextInputRenderer } from "./ui/TextInputRenderer";
import { createInputPluginObject, ZInputPlugin } from "../../helpers";
import { z } from "zod";

export * from "./TextInputPlugin";

const plugin = new TextInputPlugin();

const ZTextInput = ZInputPlugin.extend({
  required: z.boolean(),
  type: z.literal(plugin.type),
});

export const TextInputPluginObject = createInputPluginObject({
  plugin,
  type: plugin.type,
  BuilderComponent: {
    InputConfigurator: TextInputEditor,
  },
  RendererComponent: TextInputRenderer,
  Type: ZTextInput,
});
