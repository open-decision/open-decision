import { ComponentProps } from "react";
import ReactFlow, { Background, BackgroundVariant } from "react-flow-renderer";

type StageProps = ComponentProps<typeof ReactFlow>;

export const Stage = ({ ...props }: StageProps): JSX.Element => {
  return (
    <ReactFlow deleteKeyCode={46} {...props}>
      <Background variant={BackgroundVariant.Dots} gap={12} size={0.5} />
    </ReactFlow>
  );
};
