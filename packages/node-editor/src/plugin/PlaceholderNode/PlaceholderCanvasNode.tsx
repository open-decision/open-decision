import { Icon } from "@open-decision/design-system";
import { TCanvasNode } from "@open-decision/plugins-node-helpers";
import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { CanvasNodeContainer } from "../components/CanvasNode";

export const PlaceholderCanvasNode: TCanvasNode = (props) => {
  return (
    <CanvasNodeContainer {...props}>
      <Icon>
        <QuestionMarkIcon />
      </Icon>
    </CanvasNodeContainer>
  );
};
