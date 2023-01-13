import { Badge, twMerge, Icon } from "@open-decision/design-system";
import { MoonIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

type Props = { className?: string };

export function FinalNodeLabel({ className }: Props) {
  const t = useTranslations("builder.nodeEditingSidebar.nodeLabels");
  return (
    <Badge
      className={twMerge("colorScheme-warning", className)}
      data-testid="node-label"
    >
      <Icon>
        <MoonIcon />
      </Icon>
      {t("finalNode")}
    </Badge>
  );
}
