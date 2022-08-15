import { Icon, Link } from "@open-decision/design-system";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useForgotPasswordMutation } from "../../mutations/useForgotPasswordMutation";
import { ForgotPasswordForm } from "../AuthForms/ForgotPasswordForm";
import { AuthCard } from "./";
import NextLink from "next/link";

export function ForgotPasswordCard() {
  const t = useTranslations("forgotPassword");
  const {
    mutate: forgotPassword,
    error,
    isLoading,
    isSuccess,
  } = useForgotPasswordMutation();

  return !isSuccess ? (
    <AuthCard.Container>
      <AuthCard.Header>
        <AuthCard.Heading>{t("title")}</AuthCard.Heading>
        <AuthCard.Description>{t("description")}</AuthCard.Description>
      </AuthCard.Header>
      <AuthCard.Body>
        <ForgotPasswordForm
          onSubmit={forgotPassword}
          error={error}
          isLoading={isLoading}
        />
      </AuthCard.Body>
    </AuthCard.Container>
  ) : (
    <AuthCard.Container>
      <AuthCard.Header>
        <AuthCard.Heading>{t("success.title")}</AuthCard.Heading>
        <AuthCard.Description>{t("success.description")}</AuthCard.Description>
      </AuthCard.Header>
      <AuthCard.Footer>
        <NextLink passHref href="/auth/login">
          <Link
            css={{
              maxWidth: "max-content",
              gap: "$1",
              textStyle: "large-text",
            }}
          >
            <Icon>
              <ArrowLeftIcon />
            </Icon>
            {t("success.loginLink")}
          </Link>
        </NextLink>
      </AuthCard.Footer>
    </AuthCard.Container>
  );
}
