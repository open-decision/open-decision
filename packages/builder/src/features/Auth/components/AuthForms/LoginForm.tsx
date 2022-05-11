import {
  ErrorMessage,
  Form,
  Link,
  Row,
  Stack,
  SubmitButton,
} from "@open-decision/design-system";
import { useAuth } from "../../useAuth";

export function LoginForm() {
  const formState = Form.useFormState({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  formState.useSubmit(() => {
    send({
      type: "LOG_IN",
      email: formState.values.email,
      password: formState.values.password,
    });
  });

  const [state, send] = useAuth();

  return (
    <Form.Root state={formState} css={{ gap: "$6" }}>
      <Stack>
        <Form.Field state={formState} label="Mailadresse">
          <Form.Input
            required
            name={formState.names.email}
            placeholder="beispiel@web.de"
            type="email"
          />
        </Form.Field>
        <Form.Field
          state={formState}
          label={
            <Row
              css={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              Passwort
              <Link
                href="/auth/forgot_password"
                css={{ textStyle: "small-text" }}
              >
                Passwort vergessen?
              </Link>
            </Row>
          }
          css={{ marginTop: "$4" }}
        >
          <Form.Input
            type="password"
            required
            name={formState.names.password}
            placeholder="*******"
          />
        </Form.Field>
      </Stack>
      {state.context.error ? (
        <ErrorMessage>{state.context.error}</ErrorMessage>
      ) : null}
      <SubmitButton
        isLoading={state.matches("loggedOut.loggingIn")}
        type="submit"
      >
        Jetzt Anmelden
      </SubmitButton>
    </Form.Root>
  );
}
