import { Icon, Link } from "@open-decision/design-system";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { ResetPasswordForm } from "../AuthForms/ResetPasswordForm";
import { AuthCard } from "./";

export function ResetPasswordCard() {
  const t = useTranslations("resetPassword");
  const { query } = useRouter();
  const token = query.token;

  return token ? (
    <AuthCard.Container>
      <AuthCard.Header>
        <AuthCard.Heading>{t("title")}</AuthCard.Heading>
        <AuthCard.Description>{t("description")} </AuthCard.Description>
      </AuthCard.Header>
      <AuthCard.Body>
        <ResetPasswordForm token={token instanceof Object ? token[0] : token} />
      </AuthCard.Body>
    </AuthCard.Container>
  ) : (
    <AuthCard.Container>
      <AuthCard.Header>
        <AuthCard.Heading>{t("invalid.title")}</AuthCard.Heading>
        <AuthCard.Description>{t("invalid.description")} </AuthCard.Description>
      </AuthCard.Header>
      <AuthCard.Footer
        css={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginTop: "$4",
          gap: "$2",
        }}
      >
        <Icon css={{ color: "$primary9" }}>
          <ArrowRightIcon />
        </Icon>
        <Link
          css={{
            textStyle: "extra-small-heading",
          }}
          href="/auth/forgot_password"
        >
          {t("invalid.retry")}
        </Link>
      </AuthCard.Footer>
    </AuthCard.Container>
  );
}
