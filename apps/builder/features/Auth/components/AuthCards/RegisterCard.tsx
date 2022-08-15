import { Link, Text } from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import * as React from "react";
import { CombinedRegisterForm } from "../AuthForms/RegisterForm";
import { AuthCard } from "./";

export function RegisterCard() {
  const t = useTranslations("register");

  return (
    <AuthCard.Container>
      <AuthCard.Header>
        <AuthCard.Heading>{t("title")}</AuthCard.Heading>
        <AuthCard.Description>{t("description")}</AuthCard.Description>
      </AuthCard.Header>
      <AuthCard.Body>
        <CombinedRegisterForm />
      </AuthCard.Body>
      <AuthCard.Footer>
        <Text>
          {t("loginQuestion")} {""}
          <Link href="/auth/login">{t("loginCTA")}</Link>
        </Text>
      </AuthCard.Footer>
    </AuthCard.Container>
  );
}
