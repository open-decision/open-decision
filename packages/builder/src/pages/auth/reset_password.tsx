import {
  Button,
  ErrorMessage,
  Field,
  Heading,
  Icon,
  Input,
  Link,
  Stack,
  Text,
  useForm,
} from "@open-decision/design-system";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { MainContent } from "components";
import { useAuth } from "features/Auth/useAuth";
import { useRouter } from "next/router";
import * as React from "react";

export default function ResetPassword(): JSX.Element {
  const [Form, { register }] = useForm({
    defaultValues: {
      newPassword: "",
    },
  });

  const { query } = useRouter();
  const token = query.token;

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
          {token ? (
            <>
              <Heading css={{ marginBottom: "$3" }}>
                Passwort zurücksetzen
              </Heading>
              <Text css={{ color: "$gray11", marginBottom: "$8" }}>
                Bitte vergeben Sie ein neues Passwort.
              </Text>
              <Form
                onSubmit={({ newPassword }) =>
                  send({
                    type: "RESET_PASSWORD",
                    password: newPassword,
                    token: token instanceof Object ? token[0] : token,
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
                  <ErrorMessage css={{ marginTop: "$4" }}>
                    {state.context.error}
                  </ErrorMessage>
                ) : null}
                <Button type="submit" css={{ marginTop: "$6" }}>
                  Passwort zurücksetzen
                </Button>
              </Form>
            </>
          ) : (
            <>
              <Heading css={{ marginBottom: "$3" }}>Ungültig</Heading>
              <Text css={{ color: "$gray11" }}>
                Dies ist kein gültiger Link um ein Passwort zurückzusetzen.
                Bitte versuchen Sie es erneut.
              </Text>
              <Stack
                css={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: "$4",
                  gap: "$2",
                }}
              >
                <Icon css={{ color: "$primary9" }}>
                  <ArrowRightIcon />
                </Icon>
                <Link
                  css={{
                    textStyle: "extra-small-heading",
                  }}
                  href="/forgot_password"
                >
                  Passwort erneut zurücksetzen
                </Link>
              </Stack>
            </>
          )}
        </Stack>
      </Stack>
    </MainContent>
  );
}
