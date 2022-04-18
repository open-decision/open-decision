import { Icon, StyleObject } from "@open-decision/design-system";
import { RocketIcon } from "@radix-ui/react-icons";
import { NodeLabel } from "./NodeLabel";

type Props = { css?: StyleObject };

export function StartNodeLabel({ css }: Props) {
  return (
    <NodeLabel css={css}>
      <Icon>
        <RocketIcon />
      </Icon>
      Start
    </NodeLabel>
  );
}
