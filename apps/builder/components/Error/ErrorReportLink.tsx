import { Link, Icon } from "@open-decision/design-system";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

type Props = { children?: React.ReactNode };

export function ErrorReportLink({ children }: Props) {
  const t = useTranslations();

  return (
    <Link
      css={{ color: "$primary11", fontWeight: 500 }}
      target="_blank"
      href="https://open-decision.org#contact"
    >
      {children ?? t("common.ErrorCard.callToAction")}
      <Icon css={{ marginLeft: "$1" }}>
        <ExternalLinkIcon />
      </Icon>
    </Link>
  );
}
