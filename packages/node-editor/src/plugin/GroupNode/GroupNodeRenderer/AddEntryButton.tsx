import { Row, Button, Icon } from "@open-decision/design-system";
import { useInterpreterTree } from "@open-decision/interpreter-react";
import { TNodeId } from "@open-decision/tree-type";
import { PlusIcon } from "@radix-ui/react-icons";
import { GroupNodePlugin } from "../GroupNodePlugin";

const GroupNode = new GroupNodePlugin();

type Props = {
  onClick: () => void;
  groupNodeId: TNodeId;
};

export const AddEntryButton = ({ onClick, groupNodeId }: Props) => {
  const groupNode = useInterpreterTree(GroupNode.getSingle(groupNodeId));

  if (groupNode instanceof Error) return null;

  return (
    <Row className="gap-2 justify-end">
      <Button onClick={onClick} variant="secondary">
        <Icon>
          <PlusIcon />
        </Icon>
        {`${groupNode?.cta ?? "Antwort"} hinzufügen`}
      </Button>
    </Row>
  );
};
