import { Form } from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import * as React from "react";
import { ErrorMessage } from "../../../../components/Error/ErrorMessage";
import { PasswordInput } from "../../../../components/PasswordInput";
import { useNotificationStore } from "../../../../config/notifications";
import { useResetPasswordMutation } from "../../mutations/useResetPasswordMutation";

type Props = { token: string };

export function ResetPasswordForm({ token }: Props) {
  const t = useTranslations("resetPassword");
  const { addNotification } = useNotificationStore();
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
  const formState = Form.useFormState({
    defaultValues: {
      newPassword: "",
    },
  });

  formState.useSubmit(() => {
    resetPassword({
      password: formState.values.newPassword,
      token,
    });
  });

  return (
    <Form.Root state={formState}>
      <PasswordInput name={formState.names.newPassword} />
      {error ? (
        <ErrorMessage code={error.code} css={{ marginTop: "$2" }} />
      ) : null}
      <Form.Submit
        isLoading={isLoading}
        type="submit"
        css={{ marginTop: "$6" }}
      >
        {t("submitButton")}
      </Form.Submit>
    </Form.Root>
  );
}
