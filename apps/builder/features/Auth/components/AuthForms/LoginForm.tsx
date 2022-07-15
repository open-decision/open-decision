import {
  ErrorMessage,
  Form,
  Link,
  Row,
  Stack,
  SubmitButton,
} from "@open-decision/design-system";
import { useRouter } from "next/router";
import { useLocation } from "react-use";
import { useLoginMutation } from "../../mutations/useLoginMutation";

export function LoginForm() {
  const location = useLocation();
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
      const redirectUrl = new URL(
        location.search?.replace("?from=", "") ?? "/",
        process.env.NEXT_PUBLIC_OD_BUILDER_ENDPOINT
      );

      return router.replace(redirectUrl);
    },
    onError: (error) => {
      formState.setErrors({
        email: error.errors?.body?.email?._errors[0],
        password: error.errors?.body?.password?._errors[0],
      });
    },
  });

  formState.useSubmit(() => {
    login({
      email: formState.values.email,
      password: formState.values.password,
    });
  });

  return (
    <Form.Root state={formState} css={{ gap: "$6" }} resetOnSubmit={false}>
      <Stack>
        <Form.Field Label="Mailadresse">
          <Form.Input
            required
            name={formState.names.email}
            placeholder="beispiel@web.de"
            type="email"
            data-test="email"
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
            data-test="password"
          />
        </Form.Field>
      </Stack>
      {error ? (
        <ErrorMessage data-test="error">{error.message}</ErrorMessage>
      ) : null}
      <SubmitButton isLoading={isLoading} type="submit" data-test="submit">
        Jetzt Anmelden
      </SubmitButton>
    </Form.Root>
  );
}
