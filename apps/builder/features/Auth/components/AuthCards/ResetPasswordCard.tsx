import { Icon, Link } from "@open-decision/design-system";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { ResetPasswordForm } from "../AuthForms/ResetPasswordForm";
import {
  containerClasses,
  descriptionClasses,
  headerClasses,
  headingClasses,
} from "./AuthCard";

export function ResetPasswordCard() {
  const t = useTranslations("resetPassword");
  const { query } = useRouter();
  const token = query["token"];

  return token ? (
    <div className={containerClasses}>
      <header className={headerClasses}>
        <h2 className={headingClasses}>{t("title")}</h2>
        <p className={descriptionClasses}>{t("description")} </p>
      </header>
      <main>
        <ResetPasswordForm token={token instanceof Object ? token[0] : token} />
      </main>
    </div>
  ) : (
    <div className={containerClasses}>
      <header className={headerClasses}>
        <h2 className={headingClasses}>{t("invalid.title")}</h2>
        <p className={descriptionClasses}>{t("invalid.description")} </p>
      </header>
      <footer className="flex flex-row items-center mt-4 gap-2">
        <Icon className="text-primary9">
          <ArrowRightIcon />
        </Icon>
        <Link className="extra-small-heading" href="/auth/forgot_password">
          {t("invalid.retry")}
        </Link>
      </footer>
    </div>
  );
}
