import { SubmitButton, Form } from "@open-decision/design-system";
import { ODError } from "@open-decision/type-classes";
import { useTranslations } from "next-intl";
import { EmailField } from "../../../../components/EmailInput";
import { ErrorMessage } from "../../../../components/Error/ErrorMessage";

type Props = {
  onSubmit: ({ email }: { email: string }) => void;
  error: ODError | null;
  isLoading?: boolean;
};

export function ForgotPasswordForm({ onSubmit, error, isLoading }: Props) {
  const t = useTranslations("forgotPassword");
  const formState = Form.useFormState({
    defaultValues: {
      email: "",
    },
  });

  formState.useSubmit(() => {
    onSubmit({ email: formState.values.email });
  });

  return (
    <Form.Root
      state={formState}
      css={{ display: "flex", flexDirection: "column" }}
    >
      <EmailField name={formState.names.email} />
      {error ? <ErrorMessage code={error.code} /> : null}
      <SubmitButton
        isLoading={isLoading}
        type="submit"
        css={{ marginTop: "$6" }}
      >
        {t("submitButton")}
      </SubmitButton>
    </Form.Root>
  );
}
