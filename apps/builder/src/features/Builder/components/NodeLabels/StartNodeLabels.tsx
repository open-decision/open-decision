import { Badge, Icon, StyleObject } from "@open-decision/design-system";
import { RocketIcon } from "@radix-ui/react-icons";

type Props = { css?: StyleObject };

export function StartNodeLabel({ css }: Props) {
  return (
    <Badge css={{ colorScheme: "success", ...css }}>
      <Icon>
        <RocketIcon />
      </Icon>
      Start
    </Badge>
  );
}
