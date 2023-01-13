import { useAuthAPI } from "@open-decision/api-react-binding";
import { Form, Stack, SubmitButton } from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { EmailField } from "../../../../components/EmailInput";
import { ErrorMessage } from "../../../../components/Error/ErrorMessage";
import { PasswordInput } from "../../../../components/PasswordInput";

export function LoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const methods = Form.useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    mutate: login,
    error,
    isLoading,
  } = useAuthAPI().useLoginMutation({
    onSuccess: () => {
      router.push("/");
    },
    onError: (error: any) => {
      methods.setError("email", {
        message: error.errors?.body?.email?._errors[0],
      });
      methods.setError("password", {
        message: error.errors?.body?.password?._errors[0],
      });
    },
  });

  const onSubmit = methods.handleSubmit((values) => {
    login({
      email: values.email,
      password: values.password,
    });
  });

  return (
    <Form.Root methods={methods} onSubmit={onSubmit} className="gap-6">
      <Stack>
        <EmailField />
        <PasswordInput
          {...methods.register("password", {
            required: { value: true, message: "Bitte gib dein Passwort ein." },
          })}
          hasPasswordResetLink
          fieldClassName="mt-4"
        />
      </Stack>
      {error ? <ErrorMessage code={error.code} /> : null}
      <SubmitButton isLoading={isLoading} type="submit">
        {t("login.submitButton")}
      </SubmitButton>
    </Form.Root>
  );
}
