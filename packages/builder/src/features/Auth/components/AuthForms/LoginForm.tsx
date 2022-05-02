import {
  ErrorMessage,
  Field,
  Input,
  Link,
  Row,
  SubmitButton,
  useForm,
} from "@open-decision/design-system";
import { useAuth } from "../../useAuth";

export function LoginForm() {
  const [Form, { register }] = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [state, send] = useAuth();

  return (
    <Form
      onSubmit={({ email, password }) =>
        send({ type: "LOG_IN", email, password })
      }
      css={{ display: "flex", flexDirection: "column" }}
    >
      <Field label="Mailadresse">
        <Input
          {...register("email", {
            required: {
              value: true,
              message: "Eine E-Mail Addresse muss angegeben werden.",
            },
          })}
          placeholder="beispiel@web.de"
        />
      </Field>
      <Field
        label={
          <Row
            css={{
              justifyContent: "space-between",
              alignItems: "center",
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
        <Input
          type="password"
          {...register("password", {
            required: {
              value: true,
              message: "Ein Passwort muss angegeben werden.",
            },
          })}
          placeholder="*******"
        />
      </Field>
      {state.context.error ? (
        <ErrorMessage css={{ marginTop: "$2" }}>
          {state.context.error}
        </ErrorMessage>
      ) : null}
      <SubmitButton
        isLoading={state.matches("loggedOut.loggingIn")}
        type="submit"
        css={{ marginTop: "$6" }}
      >
        Jetzt Anmelden
      </SubmitButton>
    </Form>
  );
}
