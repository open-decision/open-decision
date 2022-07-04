import { ErrorMessage, SubmitButton, Form } from "@open-decision/design-system";
import { ODError } from "@open-decision/type-classes";

type Props = {
  onSubmit: ({ email }: { email: string }) => void;
  error: ODError | null;
  isLoading?: boolean;
};

export function ForgotPasswordForm({ onSubmit, error, isLoading }: Props) {
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
      <Form.Field Label="Mailadresse">
        <Form.Input
          css={{ layer: "2" }}
          required
          name={formState.names.email}
          type="email"
          placeholder="beispiel@web.de"
        />
      </Form.Field>
      {error ? <ErrorMessage>{error.message}</ErrorMessage> : null}
      <SubmitButton
        isLoading={isLoading}
        type="submit"
        css={{ marginTop: "$6" }}
      >
        Passwort zurücksetzen
      </SubmitButton>
    </Form.Root>
  );
}
