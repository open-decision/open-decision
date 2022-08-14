import * as React from "react";
import { Link, Text } from "@open-decision/design-system";
import { LoginForm } from "../AuthForms/LoginForm";
import { AuthCard } from "./";
import { useTranslations } from "next-intl";

export function LoginCard() {
  const t = useTranslations("login");

  return (
    <AuthCard.Container>
      <AuthCard.Header>
        <AuthCard.Heading>{t("title")}</AuthCard.Heading>
        <AuthCard.Description>{t("description")}</AuthCard.Description>
      </AuthCard.Header>
      <AuthCard.Body>
        <LoginForm />
      </AuthCard.Body>
      <AuthCard.Footer>
        <Text css={{ color: "$gray11" }}>
          {t("registerQuestion")}{" "}
          <Link href="/auth/register">{t("registerCTA")}</Link>
        </Text>
      </AuthCard.Footer>
    </AuthCard.Container>
  );
}
