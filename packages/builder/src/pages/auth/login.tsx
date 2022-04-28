import {
  ErrorMessage,
  Field,
  Heading,
  Input,
  Link,
  Row,
  Stack,
  SubmitButton,
  Text,
  useForm,
} from "@open-decision/design-system";
import { MainContent } from "components";
import { useAuth } from "features/Auth/useAuth";
import * as React from "react";

export default function Login(): JSX.Element {
  const [Form, { register }] = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [state, send] = useAuth();

  return (
    <MainContent
      css={{
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        background: "url(/background_pattern_auth_pages.svg)",
        backgroundSize: "cover",
        alignItems: "center",
      }}
    >
      <Stack
        center
        css={{
          height: "100%",
          width: "clamp(400px, 30vw, 500px)",
        }}
      >
        <Stack
          css={{
            width: "100%",
            backgroundColor: "$gray1",
            padding: "$9",
            boxShadow: "$7",
            borderRadius: "$md",
            layer: "1",
          }}
        >
          <Heading size="large" css={{ marginBottom: "$2" }}>
            Anmelden
          </Heading>
          <Text css={{ color: "$gray11", marginBottom: "$8" }} size="large">
            Loggen Sie sich ein um mit Open Decision fortzufahren.
          </Text>
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
          <Text css={{ marginTop: "$6", color: "$gray11" }}>
            Sie haben noch kein Konto?{" "}
            <Link href="/auth/register">Dann registrieren Sie sich hier.</Link>
          </Text>
        </Stack>
      </Stack>
    </MainContent>
  );
}
