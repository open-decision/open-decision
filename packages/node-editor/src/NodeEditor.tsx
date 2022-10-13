import { styled, StyleObject } from "@open-decision/design-system";
import { Canvas } from "./Canvas/Canvas";
import { sidebarWidth } from "./utils/constants";
import { ZoomInOut } from "./Canvas/ZoomInOut";
import { mapValues } from "remeda";
import { useSelectedNodes } from "./state";
import { NodePluginObject } from "./types/NodePluginObject";

const StyledCanvas = styled(Canvas, {
  display: "grid",
  gridTemplateColumns: `1fr ${sidebarWidth}px`,
  justifyItems: "center",
  height: "100%",
  overflow: "hidden",
});

type NodeEditorProps = {
  css?: StyleObject;
  nodePlugins: Record<string, NodePluginObject>;
};

export const NodeEditor = ({ css, nodePlugins }: NodeEditorProps) => {
  return (
    <StyledCanvas
      css={css}
      nodeTypes={mapValues(nodePlugins, (plugin) => plugin.Node)}
    >
      <ZoomInOut css={{ position: "absolute", bottom: 10, left: 10 }} />
      <Sidebar nodePlugins={nodePlugins} />
    </StyledCanvas>
  );
};

type SidebarProps = {
  nodePlugins: Record<string, NodePluginObject>;
};

export function Sidebar({ nodePlugins }: SidebarProps) {
  const Sidebars = mapValues(nodePlugins, (plugin) => plugin.Sidebar);

  const selectedNodes = useSelectedNodes();

  if (selectedNodes && Object.keys(selectedNodes).length === 1) {
    const Sidebar = Sidebars[selectedNodes[0].type];

    return <Sidebar node={selectedNodes[0]} open={true} />;
  }

  return null;
}
