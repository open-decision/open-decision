import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { Icon } from "../Icon/Icon";
import { Link } from "../Link/Link";

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
