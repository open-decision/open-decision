import { Link, Text } from "@open-decision/design-system";
import * as React from "react";
import { CombinedRegisterForm } from "../AuthForms/RegisterForm";
import { AuthCard } from "./";

export function RegisterCard() {
  return (
    <AuthCard.Container>
      <AuthCard.Header>
        <AuthCard.Heading>Registrieren</AuthCard.Heading>
        <AuthCard.Description>
          Registrieren sie sich jetzt und erstellen sie ihr erstes
          Open-Decision-Projekt.
        </AuthCard.Description>
      </AuthCard.Header>
      <AuthCard.Body>
        <CombinedRegisterForm />
      </AuthCard.Body>
      <AuthCard.Footer>
        <Text>
          Sie haben bereits ein Konto?{" "}
          <Link href="/auth/login">Dann melden Sie sich hier an.</Link>
        </Text>
      </AuthCard.Footer>
    </AuthCard.Container>
  );
}
