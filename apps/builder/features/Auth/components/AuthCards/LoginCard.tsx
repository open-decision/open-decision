import * as React from "react";
import { Link } from "@open-decision/design-system";
import { LoginForm } from "../AuthForms/LoginForm";
import { useTranslations } from "next-intl";
import {
  containerClasses,
  descriptionClasses,
  footerClasses,
  headerClasses,
  headingClasses,
} from "./AuthCard";

export function LoginCard() {
  const t = useTranslations("login");

  return (
    <div className={containerClasses}>
      <header className={headerClasses}>
        <h2 className={headingClasses}>{t("title")}</h2>
        <p className={descriptionClasses}>{t("description")}</p>
      </header>
      <main>
        <LoginForm />
      </main>
      <footer className={footerClasses}>
        {t("registerQuestion")}{" "}
        <Link href="/auth/register">{t("registerCTA")}</Link>
      </footer>
    </div>
  );
}
