import { Form, ErrorMessage } from "@open-decision/design-system";
import * as React from "react";
import { useResetPasswordMutation } from "../../mutations/useResetPasswordMutation";

type Props = { token: string };

export function ResetPasswordForm({ token }: Props) {
  const {
    mutate: resetPassword,
    error,
    isLoading,
  } = useResetPasswordMutation();
  const formState = Form.useFormState({
    defaultValues: {
      newPassword: "",
    },
  });

  formState.useSubmit(() => {
    resetPassword({
      password: formState.values.newPassword,
      token,
    });
  });

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
      {error ? (
        <ErrorMessage css={{ marginTop: "$2" }}>{error.message}</ErrorMessage>
      ) : null}
      <Form.Submit
        isLoading={isLoading}
        type="submit"
        css={{ marginTop: "$6" }}
      >
        Passwort zurücksetzen
      </Form.Submit>
    </Form.Root>
  );
}
