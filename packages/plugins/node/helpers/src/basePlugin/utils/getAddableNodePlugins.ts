import { omitBy } from "remeda";
import { NodePluginObject } from "../NodePluginObject";

export function getAddableNodePlugins(
  plugins: Record<string, NodePluginObject>
): Record<string, NodePluginObject> {
  return omitBy(plugins, ({ plugin }) => !plugin.isAddable);
}
