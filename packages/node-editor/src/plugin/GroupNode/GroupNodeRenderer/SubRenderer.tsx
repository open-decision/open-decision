import { useInterpreter } from "@open-decision/interpreter-react";
import { Renderer } from "@open-decision/renderer";

type Props = Renderer.ViewProps;

export const SubRenderer = ({
  edgePlugins,
  nodePlugins,
  className,
  classNames,
  ...props
}: Props) => {
  const { getCurrentNode } = useInterpreter();

  const currentNode = getCurrentNode();

  if (currentNode instanceof Error) return null;

  return (
    <Renderer.View
      nodePlugins={nodePlugins}
      edgePlugins={edgePlugins}
      classNames={[`p-0 h-full`, classNames, className]}
      {...props}
    />
  );
};
