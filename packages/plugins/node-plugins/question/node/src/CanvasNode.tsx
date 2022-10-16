import { Text } from "@open-decision/design-system";
import {
  CanvasNodeContainer,
  CanvasNodePlugin,
} from "@open-decision/node-plugins-helpers";
import { useEditor } from "@open-decision/node-editor";
import { TQuestionNode } from "./plugin";

export const QuestionNode: CanvasNodePlugin<TQuestionNode> = ({
  id,
  data,
  ...props
}) => {
  const { isConnecting } = useEditor();

  return (
    <CanvasNodeContainer id={id} data={data} {...props}>
      <Text
        data-connecting={isConnecting}
        data-nodeid={id}
        as="span"
        css={{ textAlign: "center", wordBreak: "break-word" }}
      >
        {data.name}
      </Text>
    </CanvasNodeContainer>
  );
};
