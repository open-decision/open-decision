import { Icon } from "@open-decision/design-system";
import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { CanvasNode, CanvasNodeContainer } from "../components/CanvasNode";

export const PlaceholderCanvasNode: CanvasNode = (props) => {
  return (
    <CanvasNodeContainer {...props}>
      <Icon>
        <QuestionMarkIcon />
      </Icon>
    </CanvasNodeContainer>
  );
};
