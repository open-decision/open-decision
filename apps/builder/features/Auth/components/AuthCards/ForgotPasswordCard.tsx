import { Icon, linkClasses } from "@open-decision/design-system";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import * as React from "react";
import { ForgotPasswordForm } from "../AuthForms/ForgotPasswordForm";
import NextLink from "next/link";
import {
  containerClasses,
  descriptionClasses,
  footerClasses,
  headerClasses,
  headingClasses,
} from "./AuthCard";
import { useAuthAPI } from "@open-decision/api-react-binding";

export function ForgotPasswordCard() {
  const t = useTranslations("forgotPassword");
  const {
    mutate: forgotPassword,
    error,
    isLoading,
    isSuccess,
  } = useAuthAPI().useForgotPasswordMutation();

  return (
    <div className={containerClasses}>
      {!isSuccess ? (
        <>
          <header className={headerClasses}>
            <h2 className={headingClasses}>{t("title")}</h2>
            <p className={descriptionClasses}>{t("description")}</p>
          </header>
          <main>
            <ForgotPasswordForm
              onSubmit={forgotPassword}
              error={error}
              isLoading={isLoading}
            />
          </main>
        </>
      ) : (
        <header className={headerClasses}>
          <h2 className={headingClasses}>{t("success.title")}</h2>
          <p className={descriptionClasses}>{t("success.description")}</p>
        </header>
      )}
      <footer className={footerClasses}>
        <NextLink
          href="/auth/login"
          className={linkClasses({ size: "large" }, ["max-w-max gap-1"])}
        >
          <Icon>
            <ArrowLeftIcon />
          </Icon>
          {t("success.loginLink")}
        </NextLink>
      </footer>
    </div>
  );
}
