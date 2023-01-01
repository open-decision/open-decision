import { addNotification, Form } from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import * as React from "react";
import { ErrorMessage } from "../../../../components/Error/ErrorMessage";
import { PasswordInput } from "../../../../components/PasswordInput";
import { useResetPasswordMutation } from "../../mutations/useResetPasswordMutation";

type Props = { token: string };

export function ResetPasswordForm({ token }: Props) {
  const t = useTranslations("resetPassword");
  const router = useRouter();
  const {
    mutate: resetPassword,
    error,
    isLoading,
  } = useResetPasswordMutation({
    onSuccess: () => {
      router.push("/");
      addNotification({
        title: "Erfolgreich Passwort geändert",
        variant: "success",
      });
    },
  });
  const methods = Form.useForm({
    defaultValues: {
      newPassword: "",
    },
  });

  return (
    <Form.Root
      methods={methods}
      onSubmit={methods.handleSubmit((values) =>
        resetPassword({ password: values.newPassword, token })
      )}
    >
      <PasswordInput {...methods.register("newPassword", { required: true })} />
      {error ? <ErrorMessage code={error.code} className="mt-2" /> : null}
      <Form.SubmitButton isLoading={isLoading} type="submit" className="mt-6">
        {t("submitButton")}
      </Form.SubmitButton>
    </Form.Root>
  );
}
