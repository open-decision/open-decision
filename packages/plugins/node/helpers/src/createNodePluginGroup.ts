import { NodePlugin, NodePluginWithVariable } from "@open-decision/tree-type";
import { ForwardRefExoticComponent } from "react";
import { mapValues, omitBy } from "remeda";
import {
  NodePluginObject,
  NodePluginObjectWithVariable,
} from "./NodePluginObject";
import { TNodeSidebar, TNodeRenderer, TCanvasNode } from "./NodePluginObject";

export const createNodePluginGroup = <
  TDefaultNodePlugins extends Record<string, NodePluginObject>,
  TNodePluginsWithVariable extends Record<string, NodePluginObjectWithVariable>
>(
  defaultNodePlugins: TDefaultNodePlugins,
  nodePluginsWithVariable: TNodePluginsWithVariable
) => {
  const defaultPlugins = mapValues(
    defaultNodePlugins,
    (plugin) => plugin.plugin
  );

  const withVariablePlugins = mapValues(
    nodePluginsWithVariable,
    (plugin) => plugin.plugin
  );

  const allPluginObjects = {
    ...defaultNodePlugins,
    ...nodePluginsWithVariable,
  };

  const allPlugins = { ...defaultPlugins, ...withVariablePlugins };

  const addablePlugins = omitBy(
    allPlugins,
    (plugin) => !plugin.isAddable
  ) as Record<string, NodePlugin | NodePluginWithVariable>;

  return {
    default: defaultPlugins,
    withVariable: withVariablePlugins,
    pluginObjects: allPluginObjects,
    plugins: allPlugins,
    addablePlugins,
    Sidebars: {
      ...mapValues(defaultNodePlugins, (plugin) => plugin.Editor.Sidebar),
      ...mapValues(nodePluginsWithVariable, (plugin) => plugin.Editor.Sidebar),
    },
    Renderers: {
      ...mapValues(defaultNodePlugins, (plugin) => plugin.Renderer),
      ...mapValues(nodePluginsWithVariable, (plugin) => plugin.Renderer),
    },
    Icons: {
      ...mapValues(defaultNodePlugins, (plugin) => plugin.Icon),
      ...mapValues(nodePluginsWithVariable, (plugin) => plugin.Icon),
    },
    Nodes: {
      ...mapValues(defaultNodePlugins, (plugin) => plugin.Editor.Node),
      ...mapValues(nodePluginsWithVariable, (plugin) => plugin.Editor.Node),
    },
  } satisfies TNodePluginGroup;
};

export type TNodePluginGroup = {
  default: Record<string, NodePlugin>;
  withVariable: Record<string, NodePluginWithVariable>;
  pluginObjects: Record<
    string,
    NodePluginObject | NodePluginObjectWithVariable
  >;
  plugins: Record<string, NodePlugin | NodePluginWithVariable>;
  addablePlugins: Record<string, NodePlugin | NodePluginWithVariable>;
  Sidebars: Record<string, TNodeSidebar>;
  Renderers: Record<string, TNodeRenderer | null>;
  Icons: Record<string, ForwardRefExoticComponent<any>>;
  Nodes: Record<string, TCanvasNode>;
};
