import {
  ErrorMessage,
  Field,
  Heading,
  Icon,
  Input,
  Link,
  Stack,
  SubmitButton,
  Text,
  useForm,
} from "@open-decision/design-system";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { MainContent } from "components";
import { useAuth } from "features/Auth/useAuth";
import * as React from "react";

export default function ForgotPassword(): JSX.Element {
  const [Form, { register }] = useForm({
    defaultValues: {
      email: "",
    },
  });

  const [state, send] = useAuth();

  const hasPasswordResetRequested = state.matches(
    "loggedOut.passwordResetRequested"
  );

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
            backgroundColor: "$gray1",
            padding: "$9",
            boxShadow: "$7",
            borderRadius: "$md",
            layer: "1",
            width: "100%",
          }}
        >
          {hasPasswordResetRequested ? (
            <>
              <Heading css={{ marginBottom: "$2" }}>
                Passwort zurückgesetzt
              </Heading>
              <Text size="large" css={{ color: "$gray11" }}>
                Eine E-Mail zum Zurücksetzen des Passworts wurde an die
                angegebene E-Mail Adresse verschickt. Bitte prüfen Sie ihr
                Postfach.
              </Text>
              <Link
                css={{
                  maxWidth: "max-content",
                  marginTop: "$4",
                  gap: "$1",
                  textStyle: "large-text",
                }}
                href="/auth/login"
              >
                <Icon>
                  <ArrowLeftIcon />
                </Icon>
                Zurück zum Login
              </Link>
            </>
          ) : (
            <>
              <Heading css={{ marginBottom: "$3" }}>
                Passwort zurücksetzen
              </Heading>
              <Text css={{ color: "$gray11", marginBottom: "$8" }} size="large">
                Bitte geben Sie die E-Mail Adresse an, mit der Sie sich bei Open
                Decision registriert haben.
              </Text>
              <Form
                onSubmit={({ email }) =>
                  send({ type: "REQUEST_PASSWORD_RESET", email })
                }
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
            </>
          )}
        </Stack>
      </Stack>
    </MainContent>
  );
}
