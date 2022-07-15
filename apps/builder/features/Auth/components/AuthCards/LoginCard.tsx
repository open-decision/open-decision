import * as React from "react";
import { Link, Text } from "@open-decision/design-system";
import { LoginForm } from "../AuthForms/LoginForm";
import { AuthCard } from "./";

export function LoginCard() {
  return (
    <AuthCard.Container>
      <AuthCard.Header>
        <AuthCard.Heading>Anmelden</AuthCard.Heading>
        <AuthCard.Description>
          Loggen Sie sich ein um mit Open-Decision fortzufahren.
        </AuthCard.Description>
      </AuthCard.Header>
      <AuthCard.Body>
        <LoginForm />
      </AuthCard.Body>
      <AuthCard.Footer>
        <Text css={{ color: "$gray11" }}>
          Sie haben noch kein Konto?{" "}
          <Link data-test="registerLink" href="/auth/register">
            Dann registrieren Sie sich hier.
          </Link>
        </Text>
      </AuthCard.Footer>
    </AuthCard.Container>
  );
}
