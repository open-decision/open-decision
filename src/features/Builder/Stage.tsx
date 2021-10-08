import { ComponentProps } from "react";
import ReactFlow from "react-flow-renderer";

type StageProps = ComponentProps<typeof ReactFlow>;

export const Stage = ({ ...props }: StageProps): JSX.Element => {
  return <ReactFlow deleteKeyCode={46} {...props} />;
};
