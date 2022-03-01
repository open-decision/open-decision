import {
  Button,
  ErrorMessage,
  Field,
  Heading,
  Input,
  Stack,
  Text,
  useForm,
} from "@open-decision/design-system";
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
          <Heading css={{ marginBottom: "$3" }}>Passwort zurücksetzen</Heading>
          <Text css={{ color: "$gray11", marginBottom: "$8" }}>
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
                {...register("email", {
                  required: {
                    value: true,
                    message: "Eine E-Mail Addresse muss angegeben werden.",
                  },
                })}
                placeholder="beispiel@web.de"
              />
            </Field>
            {state.context.error ? (
              <ErrorMessage css={{ marginTop: "$4" }}>
                {state.context.error}
              </ErrorMessage>
            ) : null}
            <Button type="submit" css={{ marginTop: "$6" }}>
              Passwort zurücksetzen
            </Button>
          </Form>
        </Stack>
      </Stack>
    </MainContent>
  );
}
