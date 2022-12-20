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
  const methods = Form.useForm({
    defaultValues: {
      email: "",
    },
  });

  return (
    <Form.Root
      methods={methods}
      onSubmit={methods.handleSubmit(onSubmit)}
      className="flex flex-col"
    >
      <EmailField />
      {error ? <ErrorMessage code={error.code} /> : null}
      <SubmitButton isLoading={isLoading} type="submit" className="mt-6">
        {t("submitButton")}
      </SubmitButton>
    </Form.Root>
  );
}
