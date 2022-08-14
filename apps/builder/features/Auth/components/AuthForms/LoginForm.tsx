import { Form, Stack, SubmitButton } from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { EmailField } from "../../../../components/EmailInput";
import { ErrorMessage } from "../../../../components/Error/ErrorMessage";
import { PasswordInput } from "../../../../components/PasswordInput";
import { useLoginMutation } from "../../mutations/useLoginMutation";

export function LoginForm() {
  const t = useTranslations();
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
      return router.push("/");
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
        <EmailField name={formState.names.email} />
        <PasswordInput
          name={formState.names.password}
          hasPasswordResetLink
          fieldCss={{ marginTop: "$4" }}
        />
      </Stack>
      {error ? <ErrorMessage code={error.code} /> : null}
      <SubmitButton isLoading={isLoading} type="submit">
        {t("login.submitButton")}
      </SubmitButton>
    </Form.Root>
  );
}
