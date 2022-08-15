import {
  ErrorMessage as SystemErrorMessage,
  ErrorMessageProps,
} from "@open-decision/design-system";

import { ErrorCodes } from "@open-decision/type-classes";
import { useTranslations } from "next-intl";

type Props = { code: ErrorCodes } & ErrorMessageProps;

export const ErrorMessage = ({ code, ...props }: Props) => {
  const t = useTranslations("common.errors");

  console.log(code);

  return (
    <SystemErrorMessage data-test="form-error" {...props}>
      {t(`${code}.long`)}
    </SystemErrorMessage>
  );
};
