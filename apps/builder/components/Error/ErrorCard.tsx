import { StyleObject, Text } from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import { InfoBox } from "../../features/Notifications/InfoBox";
import { ErrorReportLink } from "./ErrorReportLink";

export type ErrorCardProps = {
  title?: string;
  description?: string;
  css?: StyleObject;
};

export function ErrorCard({ title, description, css }: ErrorCardProps) {
  const t = useTranslations();

  return (
    <InfoBox
      title={title ?? t("common.ErrorCard.titleFallback")}
      content={
        <>
          <Text size="large" css={{ marginBottom: "$6" }}>
            {description ?? t("common.ErrorCard.descriptionFallback")}
          </Text>
          <Text>
            {t("common.ErrorCard.callToAction")} <ErrorReportLink />
          </Text>
        </>
      }
      variant="danger"
      css={{ boxShadow: "$1", ...css }}
    />
  );
}
