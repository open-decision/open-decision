import { z } from "zod";
import { createInputPluginObject, ZInputPlugin } from "../../helpers";
import { PlaceholderInputPlugin } from "./PlaceholderInputPlugin";
import { PlaceholderInputRenderer } from "./ui/PlaceholderRenderer";

export * from "./PlaceholderInputPlugin";

const plugin = new PlaceholderInputPlugin();
const ZPlaceholderInput = ZInputPlugin.extend({ type: z.literal(plugin.type) });

export const PlaceholderInputPluginObject = createInputPluginObject({
  plugin,
  type: plugin.type,
  BuilderComponent: {},
  RendererComponent: PlaceholderInputRenderer,
  Type: ZPlaceholderInput,
});
