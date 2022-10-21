import { useTranslations } from "next-intl";
import { InfoBox, Text, StyleObject } from "@open-decision/design-system";
import { ErrorReportLink } from "@open-decision/design-system/src/Error/ErrorReportLink";
import { ODError } from "@open-decision/type-classes";

export type ErrorCardProps = {
  error: ODError;
  css?: StyleObject;
};

export function ErrorCard({ error, css }: ErrorCardProps) {
  const t = useTranslations();

  return (
    <InfoBox
      title={t(`common.errors.${error.code}.short`)}
      content={
        <>
          <Text
            size="large"
            css={{ marginBottom: !error.isOperational ? "$6" : "0" }}
          >
            {t(`common.errors.${error.code}.long`)}
          </Text>
          {!error.isOperational ? (
            <Text>
              {t("common.ErrorCard.callToAction")} <ErrorReportLink />
            </Text>
          ) : null}
        </>
      }
      variant="danger"
      css={{ boxShadow: "$2", border: "1px solid $gray4", ...css }}
    />
  );
}
