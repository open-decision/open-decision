import { Badge, Icon, twMerge } from "@open-decision/design-system";
import { RocketIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

type Props = { className?: string };

export function StartNodeLabel({ className }: Props) {
  const t = useTranslations("builder.nodeEditingSidebar.nodeLabels");
  return (
    <Badge
      className={twMerge("colorScheme-success", className)}
      data-testid="node-label"
    >
      <Icon>
        <RocketIcon />
      </Icon>
      {t("startNode")}
    </Badge>
  );
}
