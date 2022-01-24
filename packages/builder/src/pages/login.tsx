import {
  Button,
  ErrorMessage,
  Field,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useForm,
} from "@open-legal-tech/design-system";
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
          maxWidth: "550px",
        }}
      >
        <Stack
          css={{
            backgroundColor: "$gray1",
            padding: "$9",
            boxShadow: "$7",
            borderRadius: "$md",
          }}
        >
          <Heading size="large" css={{ marginBottom: "$3" }}>
            Anmelden
          </Heading>
          <Text css={{ color: "$gray11", marginBottom: "$8" }}>
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
            <Field label="Passwort" css={{ marginTop: "$4" }}>
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
            <Link
              css={{
                marginLeft: "auto",
                marginTop: "$4",
                color: "$black",
              }}
              underline={false}
              href="/forgot_password"
            >
              Passwort vergessen?
            </Link>
            {state.context.error ? (
              <ErrorMessage css={{ marginTop: "$4" }}>
                {state.context.error}
              </ErrorMessage>
            ) : null}
            <Button type="submit" css={{ marginTop: "$6" }}>
              Jetzt Anmelden
            </Button>
          </Form>
          <Text css={{ marginTop: "$6" }}>
            Sie haben noch kein Konto?{" "}
            <Link href="/register">Dann registrieren Sie sich hier</Link>
          </Text>
        </Stack>
      </Stack>
    </MainContent>
  );
}
