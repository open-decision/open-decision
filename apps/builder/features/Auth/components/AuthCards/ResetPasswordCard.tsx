import { Icon, Link } from "@open-decision/design-system";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { ResetPasswordForm } from "../AuthForms/ResetPasswordForm";
import { AuthCard } from "./";

export function ResetPasswordCard() {
  const { query } = useRouter();
  const token = query.token;

  return token ? (
    <AuthCard.Container>
      <AuthCard.Header>
        <AuthCard.Heading>Passwort zurücksetzen</AuthCard.Heading>
        <AuthCard.Description>
          Bitte vergeben Sie ein neues Passwort.
        </AuthCard.Description>
      </AuthCard.Header>
      <AuthCard.Body>
        <ResetPasswordForm token={token instanceof Object ? token[0] : token} />
      </AuthCard.Body>
    </AuthCard.Container>
  ) : (
    <AuthCard.Container>
      <AuthCard.Header>
        <AuthCard.Heading>Ungültig</AuthCard.Heading>
        <AuthCard.Description>
          Dies ist kein gültiger Link um ein Passwort zurückzusetzen. Bitte
          versuchen Sie es erneut.
        </AuthCard.Description>
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
          Passwort erneut zurücksetzen
        </Link>
      </AuthCard.Footer>
    </AuthCard.Container>
  );
}
