import {
  useForm,
  Field,
  Input,
  ErrorMessage,
  SubmitButton,
} from "@open-decision/design-system";
import { useAuth } from "../../useAuth";

export function ForgotPasswordForm() {
  const [Form, { register }] = useForm({
    defaultValues: {
      email: "",
    },
  });

  const [state, send] = useAuth();

  return (
    <Form
      onSubmit={({ email }) => send({ type: "REQUEST_PASSWORD_RESET", email })}
      css={{ display: "flex", flexDirection: "column" }}
    >
      <Field label="Mailadresse">
        <Input
          css={{ layer: "2" }}
          {...register("email", {
            required: {
              value: true,
              message: "Eine E-Mail Addresse muss angegeben werden.",
            },
          })}
          type="email"
          placeholder="beispiel@web.de"
        />
      </Field>
      {state.context.error ? (
        <ErrorMessage css={{ marginTop: "$2" }}>
          {state.context.error}
        </ErrorMessage>
      ) : null}
      <SubmitButton
        isLoading={state.matches("loggedOut.requestPasswordReset")}
        type="submit"
        css={{ marginTop: "$6" }}
      >
        Passwort zurücksetzen
      </SubmitButton>
    </Form>
  );
}
