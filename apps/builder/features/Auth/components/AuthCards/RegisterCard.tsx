import { Link, linkClasses } from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import * as React from "react";
import { CombinedRegisterForm } from "../AuthForms/RegisterForm";
import {
  containerClasses,
  headerClasses,
  descriptionClasses,
  headingClasses,
  footerClasses,
} from "./AuthCard";

export function RegisterCard() {
  const t = useTranslations("register");

  return (
    <div className={containerClasses}>
      <header className={headerClasses}>
        <h2 className={headingClasses}>{t("title")}</h2>
        <p className={descriptionClasses}>{t("description")}</p>
      </header>
      <main>
        <CombinedRegisterForm />
      </main>
      <footer className={footerClasses}>
        {t("loginQuestion")}{" "}
        <Link className={linkClasses()} href="/auth/login">
          {t("loginCTA")}
        </Link>
      </footer>
    </div>
  );
}
