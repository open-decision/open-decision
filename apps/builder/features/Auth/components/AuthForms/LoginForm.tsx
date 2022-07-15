import {
  ErrorMessage,
  Form,
  Link,
  Row,
  Stack,
  SubmitButton,
} from "@open-decision/design-system";
import { useRouter } from "next/router";
import { useLoginMutation } from "../../mutations/useLoginMutation";

export function LoginForm() {
  const router = useRouter();
  const formState = Form.useFormState({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    mutate: login,
    error,
    isLoading,
  } = useLoginMutation({
    onSuccess: () => {
      return router.replace("/", undefined);
    },
  });

  formState.useSubmit(() => {
    login({
      email: formState.values.email,
      password: formState.values.password,
    });
  });

  return (
    <Form.Root state={formState} css={{ gap: "$6" }}>
      <Stack>
        <Form.Field Label="Mailadresse">
          <Form.Input
            required
            name={formState.names.email}
            placeholder="beispiel@web.de"
            type="email"
          />
        </Form.Field>
        <Form.Field
          Label={
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
      {error ? <ErrorMessage>{error.message}</ErrorMessage> : null}
      <SubmitButton isLoading={isLoading} type="submit">
        Jetzt Anmelden
      </SubmitButton>
    </Form.Root>
  );
}
