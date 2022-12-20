import * as React from "react";
import { Form, linkClasses, Row } from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import NextLink from "next/link";

const LabelWithForgortPasswordLink = () => {
  const t = useTranslations();

  return (
    <Row className="justify-between items-center w-full">
      {t("common.passwordInput.label")}
      <NextLink
        href="/auth/forgot_password"
        className={linkClasses({ size: "small" })}
      >
        {t("common.passwordInput.forgotPasswordLink")}
      </NextLink>
    </Row>
  );
};

type Props = {
  hasPasswordResetLink?: boolean;
  fieldClassName?: string;
  inputClassName?: string;
  customLabel?: string;
  required?: boolean;
} & Partial<Form.InputProps>;

export const PasswordInput = React.forwardRef<HTMLInputElement, Props>(
  function PasswordInput(
    {
      hasPasswordResetLink,
      fieldClassName,
      inputClassName,
      customLabel,
      ...props
    },
    ref
  ) {
    const t = useTranslations();

    const labels = {
      default: t("common.passwordInput.label"),
      withLink: <LabelWithForgortPasswordLink />,
      customLabel,
    };

    return (
      <Form.Field
        className={fieldClassName}
        Label={
          labels[
            customLabel
              ? "customLabel"
              : hasPasswordResetLink
              ? "withLink"
              : "default"
          ]
        }
      >
        <Form.Input
          ref={ref}
          className={inputClassName}
          type="password"
          placeholder="*******"
          {...props}
        />
      </Form.Field>
    );
  }
);
