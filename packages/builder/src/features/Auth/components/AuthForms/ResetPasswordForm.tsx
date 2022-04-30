import {
  useForm,
  Field,
  Input,
  ErrorMessage,
  Button,
} from "@open-decision/design-system";
import * as React from "react";
import { useAuth } from "../../useAuth";

type Props = { token: string };

export function ResetPasswordForm({ token }: Props) {
  const [Form, { register }] = useForm({
    defaultValues: {
      newPassword: "",
    },
  });

  const [state, send] = useAuth();

  return (
    <Form
      onSubmit={({ newPassword }) =>
        send({
          type: "RESET_PASSWORD",
          password: newPassword,
          token,
        })
      }
      css={{ display: "flex", flexDirection: "column" }}
    >
      <Field label="Neues Passwort">
        <Input
          {...register("newPassword", {
            required: {
              value: true,
              message: "Bitte vergeben Sie ein neues Passwort.",
            },
          })}
          type="password"
          placeholder="*******"
        />
      </Field>
      {state.context.error ? (
        <ErrorMessage css={{ marginTop: "$2" }}>
          {state.context.error}
        </ErrorMessage>
      ) : null}
      <Button type="submit" css={{ marginTop: "$6" }}>
        Passwort zurücksetzen
      </Button>
    </Form>
  );
}
