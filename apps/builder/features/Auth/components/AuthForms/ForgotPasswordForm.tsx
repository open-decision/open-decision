import { ErrorMessage, SubmitButton, Form } from "@open-decision/design-system";
import { useAuth } from "../../useAuth";

export function ForgotPasswordForm() {
  const formState = Form.useFormState({
    defaultValues: {
      email: "",
    },
  });

  formState.useSubmit(() => {
    send({ type: "REQUEST_PASSWORD_RESET", email: formState.values.email });
  });

  const [state, send] = useAuth();

  return (
    <Form.Root
      state={formState}
      css={{ display: "flex", flexDirection: "column" }}
    >
      <Form.Field label="Mailadresse">
        <Form.Input
          css={{ layer: "2" }}
          required
          name={formState.names.email}
          type="email"
          placeholder="beispiel@web.de"
        />
      </Form.Field>
      {state.context.error ? (
        <ErrorMessage>{state.context.error}</ErrorMessage>
      ) : null}
      <SubmitButton
        isLoading={state.matches("loggedOut.requestPasswordReset")}
        type="submit"
        css={{ marginTop: "$6" }}
      >
        Passwort zurücksetzen
      </SubmitButton>
    </Form.Root>
  );
}
