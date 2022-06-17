import { Form, ErrorMessage, Button } from "@open-decision/design-system";
import * as React from "react";
import { useAuth } from "../../useAuth";

type Props = { token: string };

export function ResetPasswordForm({ token }: Props) {
  const formState = Form.useFormState({
    defaultValues: {
      newPassword: "",
    },
  });

  formState.useSubmit(() => {
    send({
      type: "RESET_PASSWORD",
      password: formState.values.newPassword,
      token,
    });
  });

  const [state, send] = useAuth();

  return (
    <Form.Root state={formState}>
      <Form.Field Label="Neues Passwort">
        <Form.Input
          name={formState.names.newPassword}
          required
          type="password"
          placeholder="*******"
        />
      </Form.Field>
      {state.context.error ? (
        <ErrorMessage css={{ marginTop: "$2" }}>
          {state.context.error}
        </ErrorMessage>
      ) : null}
      <Button type="submit" css={{ marginTop: "$6" }}>
        Passwort zurücksetzen
      </Button>
    </Form.Root>
  );
}
