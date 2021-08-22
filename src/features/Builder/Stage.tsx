import { ComponentProps } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
} from "react-flow-renderer";

type StageProps = ComponentProps<typeof ReactFlow>;

export const Stage = ({ ...props }: StageProps): JSX.Element => {
  return (
    <ReactFlow deleteKeyCode={46} {...props}>
      <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
      <Controls />
    </ReactFlow>
  );
};
