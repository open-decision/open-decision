import { Form, Link, Row, StyleObject } from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import NextLink from "next/link";

const LabelWithForgortPasswordLink = () => {
  const t = useTranslations();

  return (
    <Row
      css={{
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      {t("common.passwordInput.label")}
      <NextLink passHref href="/auth/forgot_password">
        <Link css={{ textStyle: "small-text" }}>
          {t("common.passwordInput.forgotPasswordLink")}
        </Link>
      </NextLink>
    </Row>
  );
};

type Props = {
  hasPasswordResetLink?: boolean;
  fieldCss?: StyleObject;
  inputCss?: StyleObject;
  customLabel?: string;
} & Omit<Form.InputProps, "css">;

export const PasswordInput = ({
  hasPasswordResetLink,
  fieldCss,
  inputCss,
  customLabel,
  ...props
}: Props) => {
  const t = useTranslations();

  const labels = {
    default: t("common.passwordInput.label"),
    withLink: <LabelWithForgortPasswordLink />,
    customLabel,
  };

  return (
    <Form.Field
      css={fieldCss}
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
        css={inputCss}
        type="password"
        required
        placeholder="*******"
        {...props}
      />
    </Form.Field>
  );
};
