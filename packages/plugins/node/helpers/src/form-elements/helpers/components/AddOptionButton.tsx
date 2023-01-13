import { Button, Icon } from "@open-decision/design-system";
import { PlusIcon } from "@radix-ui/react-icons";

export const AddOptionButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button size="small" variant="secondary" onClick={onClick}>
      <Icon>
        <PlusIcon />
      </Icon>
      Neue Antwortmöglichkeit
    </Button>
  );
};
