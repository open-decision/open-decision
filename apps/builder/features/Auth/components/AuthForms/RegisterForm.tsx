import { Form, Stack, Box, Row, InfoBox } from "@open-decision/design-system";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { InternalLink } from "../../../../components/InternalLink";
import { useRegisterMutation } from "../../mutations/useRegisterMutation";
import { useRouter } from "next/router";
import { safeFetch } from "@open-decision/api-helpers";
import { useTranslations } from "next-intl";
import { EmailField } from "../../../../components/EmailInput";
import { PasswordInput } from "../../../../components/PasswordInput";
import { ErrorMessage } from "../../../../components/Error/ErrorMessage";
import { APIErrors } from "@open-decision/type-classes";

type Data = { email: string };

const useIsOnWhiteListQuery = (
  options?: UseMutationOptions<unknown, unknown, Data>
) =>
  useMutation(
    ["isOnWhiteList"],
    async (data: Data) => {
      const result = await safeFetch(
        `/users/is-whitelisted`,
        {
          body: data,
          method: "POST",
        },
        {}
      );

      if (!result.data.isWhitelisted) throw new Error();

      return result.data;
    },
    { ...options }
  );

export function CombinedRegisterForm() {
  const t = useTranslations();

  const formState = Form.useFormState({
    defaultValues: {
      email: "",
    },
  });

  formState.useSubmit(() => {
    mutate({ email: formState.values.email });
  });

  const { mutate, isSuccess, isError, isLoading, variables } =
    useIsOnWhiteListQuery();

  // Here we show the RegisterForm either when the below process has happened or directly if the
  // whitelist feature is deactivated
  if (
    (isSuccess && variables?.email) ||
    !!process.env["NEXT_PUBLIC_FEATURE_WHITELIST"]
  )
    return <RegisterForm email={variables?.email} />;

  if (isError) {
    return (
      <InfoBox
        content={t("register.unauthorizedAccountCreation.content")}
        title={t("register.unauthorizedAccountCreation.title")}
        variant="info"
      />
    );
  }

  return (
    <Form.Root
      state={formState}
      css={{ display: "flex", flexDirection: "column" }}
    >
      <EmailField name={formState.names.email} />
      <Form.Submit isLoading={isLoading} css={{ marginTop: "$6" }}>
        {t("register.submitButton")}
      </Form.Submit>
    </Form.Root>
  );
}

function RegisterForm({ email }: { email?: string }) {
  const t = useTranslations();

  const formState = Form.useFormState({
    defaultValues: {
      email: email ?? "",
      password: "",
      passwordConfirmation: "",
      legal: false,
      privacy: false,
    },
  });

  const router = useRouter();
  const {
    mutate: register,
    error,
    isLoading,
    reset,
    isError,
  } = useRegisterMutation({
    onSuccess: () => router.push("/"),
    onError: (error) => {
      formState.setErrors({
        password: t(
          `common.errors.${
            error?.errors?.body?.password?._errors[0] as keyof typeof APIErrors
          }.long`
        ),
        email: `common.errors.${
          error?.errors?.body?.email?._errors[0] as keyof typeof APIErrors
        }.long`,
      });
    },
  });

  formState.useSubmit(() => {
    register({
      email: formState.values.email,
      password: formState.values.password,
      toc: true,
    });
  });

  formState.useValidate(() => {
    if (formState.values.password !== formState.values.passwordConfirmation)
      formState.setError(
        formState.names.passwordConfirmation,
        "Die Passwörter stimmen nicht überein."
      );
  });

  return (
    <Form.Root state={formState} resetOnSubmit={false}>
      <EmailField name={formState.names.email} />
      <PasswordInput
        name={formState.names.password}
        fieldCss={{ marginTop: "$4" }}
      />
      <PasswordInput
        customLabel={t("register.passwordConfirmation.label")}
        name={formState.names.passwordConfirmation}
        fieldCss={{ marginTop: "$4" }}
      />
      <Stack css={{ gap: "$2", marginTop: "$4" }}>
        <Stack>
          <Row css={{ alignItems: "center", gap: "$2" }}>
            <Form.Checkbox
              formState={formState}
              name={formState.names.privacy}
              required
            />
            <Box as="span" css={{ lineHeight: "2px" }}>
              <Form.Label
                css={{ display: "inline" }}
                size="small"
                name={formState.names.privacy}
              >
                {t("register.dataProtection.start")}
              </Form.Label>{" "}
              <InternalLink
                href="https://open-decision.org/privacy"
                target="_blank"
                size="small"
              >
                {t("register.dataProtection.link")}
              </InternalLink>{" "}
              <Form.Label
                css={{ display: "inline" }}
                size="small"
                name={formState.names.privacy}
              >
                {t("register.dataProtection.end")}
              </Form.Label>
            </Box>
          </Row>
          <Form.Error
            data-test={`error-${formState.names.privacy}`}
            name={formState.names.privacy}
            css={{ marginTop: "$2" }}
          />
        </Stack>
        <Stack>
          <Row css={{ alignItems: "center", gap: "$2" }}>
            <Form.Checkbox
              formState={formState}
              name={formState.names.legal}
              required
            />
            <Form.Label
              css={{ display: "inline" }}
              size="small"
              name={formState.names.legal}
            >
              {t("register.alphaDisclaimer")}
            </Form.Label>
          </Row>
          <Form.Error
            data-test={`error-${formState.names.legal}`}
            name={formState.names.legal}
            css={{ marginTop: "$2" }}
          />
        </Stack>
      </Stack>
      {isError ? (
        <ErrorMessage css={{ marginTop: "$4" }} code={error.code} />
      ) : null}
      <Form.Submit
        isLoading={isLoading}
        css={{ marginTop: "$4" }}
        type="submit"
      >
        {t("register.submitButton")}
      </Form.Submit>
    </Form.Root>
  );
}
