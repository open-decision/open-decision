import { Badge, Icon, StyleObject } from "@open-decision/design-system";
import { RocketIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

type Props = { css?: StyleObject };

export function StartNodeLabel({ css }: Props) {
  const t = useTranslations("builder.nodeEditingSidebar.nodeLabels");
  return (
    <Badge css={{ colorScheme: "success", ...css }}>
      <Icon>
        <RocketIcon />
      </Icon>
      {t("startNode")}
    </Badge>
  );
}
