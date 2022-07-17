import { Icon, Link } from "@open-decision/design-system";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { useForgotPasswordMutation } from "../../mutations/useForgotPasswordMutation";
import { ForgotPasswordForm } from "../AuthForms/ForgotPasswordForm";
import { AuthCard } from "./";

export function ForgotPasswordCard() {
  const {
    mutate: forgotPassword,
    error,
    isLoading,
    isSuccess,
  } = useForgotPasswordMutation();

  return !isSuccess ? (
    <AuthCard.Container>
      <AuthCard.Header>
        <AuthCard.Heading>Passwort zurücksetzen</AuthCard.Heading>
        <AuthCard.Description>
          Bitte geben Sie die E-Mail Adresse an, mit der Sie sich bei Open
          Decision registriert haben.
        </AuthCard.Description>
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
        <AuthCard.Heading>Passwort zurückgesetzt</AuthCard.Heading>
        <AuthCard.Description>
          Eine E-Mail zum Zurücksetzen des Passworts wurde an die angegebene
          E-Mail Adresse verschickt. Bitte prüfen Sie ihr Postfach.
        </AuthCard.Description>
      </AuthCard.Header>
      <AuthCard.Footer>
        <Link
          css={{
            maxWidth: "max-content",
            gap: "$1",
            textStyle: "large-text",
          }}
          href="/auth/login"
        >
          <Icon>
            <ArrowLeftIcon />
          </Icon>
          Zurück zum Login
        </Link>
      </AuthCard.Footer>
    </AuthCard.Container>
  );
}
