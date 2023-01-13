import { Form, Stack, Row, linkClasses } from "@open-decision/design-system";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { EmailField } from "../../../../components/EmailInput";
import { PasswordInput } from "../../../../components/PasswordInput";
import { ErrorMessage } from "../../../../components/Error/ErrorMessage";
import { APIErrors, isAPIError } from "@open-decision/type-classes";
import Link from "next/link";
import { useAuthAPI } from "@open-decision/api-react-binding";

export function RegisterForm({ email }: { email?: string }) {
  const t = useTranslations();

  const methods = Form.useForm<{
    email: string;
    password: string;
    passwordConfirmation: string;
    legal: boolean;
    privacy: boolean;
  }>({
    defaultValues: {
      email,
    },
  });

  const router = useRouter();
  const {
    mutate: register,
    error,
    isLoading,
    isError,
  } = useAuthAPI().useRegisterMutation({
    retry: (failureCount, error) => {
      if (isAPIError(error) && error.code === "EMAIL_ALREADY_USED") {
        return false;
      }

      return failureCount < 3;
    },
    onSuccess: () => router.push("/"),
    onError: (error: any) => {
      const passwordFieldError = error?.errors?.body?.password
        ?._errors[0] as keyof typeof APIErrors;
      const emailFieldError = error?.errors?.body?.email
        ?._errors[0] as keyof typeof APIErrors;

      methods.setError("password", {
        message: passwordFieldError
          ? t(`common.errors.${passwordFieldError}.long`)
          : undefined,
      });

      methods.setError("email", {
        message: emailFieldError
          ? t(`common.errors.${emailFieldError}.long`)
          : undefined,
      });
    },
  });

  return (
    <Form.Root
      methods={methods}
      onSubmit={methods.handleSubmit((values) =>
        register({
          email: values.email,
          password: values.password,
          toc: true,
        })
      )}
    >
      <EmailField />
      <PasswordInput
        {...methods.register("password", {
          required: {
            value: true,
            message: "Dieses Feld muss ausgefüllt werden.",
          },
        })}
        fieldClassName="mt-4"
      />
      <PasswordInput
        customLabel={t("register.passwordConfirmation.label")}
        {...methods.register("passwordConfirmation", {
          required: {
            value: true,
            message: "Dieses Feld muss ausgefüllt werden.",
          },
          validate: (value) =>
            value === methods.getValues("password") ||
            "Die Passwörter stimmen nicht überein.",
        })}
        fieldClassName="mt-4"
      />
      <Stack className="gap-2 mt-4">
        <Stack>
          <Row className="items-center gap-2">
            <Form.Checkbox
              {...methods.register("privacy", {
                required: {
                  value: true,
                  message: "Bitte bestätigen sie diese Bedingung.",
                },
              })}
            />
            <span className="flex-1">
              <Form.Label className="inline" htmlFor="privacy">
                {t("register.dataProtection.start")}
              </Form.Label>{" "}
              <Link
                className={linkClasses({})}
                href="https://open-decision.org/privacy"
                target="_blank"
              >
                {t("register.dataProtection.link")}
              </Link>{" "}
              <Form.Label className="inline" htmlFor="privacy">
                {t("register.dataProtection.end")}
              </Form.Label>
            </span>
          </Row>
          <Form.Error
            data-test={`error-privacy`}
            className="mt-2"
            name="privacy"
          />
        </Stack>
        <Stack>
          <Row className="items-center gap-2">
            <Form.Checkbox
              {...methods.register("legal", {
                required: {
                  value: true,
                  message: "Bitte bestätigen sie diese Bedingung.",
                },
              })}
            />
            <Form.Label className="inline flex-1" htmlFor="legal">
              {t("register.alphaDisclaimer")}
            </Form.Label>
          </Row>
          <Form.Error data-test={`error-legal`} name="legal" className="mt-2" />
        </Stack>
      </Stack>
      {isError ? <ErrorMessage className="mt-4" code={error.code} /> : null}
      <Form.SubmitButton isLoading={isLoading} className="mt-4" type="submit">
        {t("register.submitButton")}
      </Form.SubmitButton>
    </Form.Root>
  );
}
