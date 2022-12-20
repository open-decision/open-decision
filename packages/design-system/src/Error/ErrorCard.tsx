import { useTranslations } from "next-intl";
import { InfoBox, Text } from "../";
import { ErrorReportLink } from "./ErrorReportLink";
import { ODError } from "@open-decision/type-classes";
import { twMerge } from "../utils";

export type ErrorCardProps = {
  error: ODError;
  className?: string;
};

const baseClasses = "shadow-2 border border-gray4";

export function ErrorCard({ error, className }: ErrorCardProps) {
  const t = useTranslations();

  return (
    <InfoBox
      title={t(`common.errors.${error.code}.short`)}
      content={
        <>
          <Text size="large" className={error.isOperational ? "mb-0" : "mb-6"}>
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
      className={className ? twMerge(baseClasses, className) : baseClasses}
    />
  );
}
