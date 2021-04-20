import { ComponentProps } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
} from "react-flow-renderer";

type StageProps = ComponentProps<typeof ReactFlow>;

export const Stage = ({ ...props }: StageProps): JSX.Element => {
  return (
    <ReactFlow deleteKeyCode={46} {...props}>
      <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
      <MiniMap
        nodeColor={(node) => {
          switch (node.type) {
            case "input":
              return "red";
            case "default":
              return "#00ff00";
            case "output":
              return "rgb(0,0,255)";
            default:
              return "#eee";
          }
        }}
        nodeStrokeWidth={3}
      />
      <Controls />
    </ReactFlow>
  );
};
