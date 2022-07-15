import {
  Form,
  ErrorMessage,
  Stack,
  Box,
  Row,
} from "@open-decision/design-system";
import { useMutation, UseMutationOptions } from "react-query";
import axios from "axios";
import { InfoBox } from "../../../Notifications/InfoBox";
import { InternalLink } from "../../../../components/InternalLink";
import { useRegisterMutation } from "../../mutations/useRegisterMutation";
import { useRouter } from "next/router";

type Data = { email: string };

const useIsOnWhiteListQuery = (
  options?: UseMutationOptions<unknown, unknown, Data>
) =>
  useMutation(
    "isOnWhiteList",
    async (data: Data) => {
      const result = await axios({
        url: `/users/is-whitelisted`,
        data,
        method: "POST",
      });

      if (!result.data.isWhitelisted) throw new Error();

      return result.data;
    },
    { ...options }
  );

export function CombinedRegisterForm() {
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
    !!process.env.NEXT_PUBLIC_FEATURE_WHITELIST
  )
    return <RegisterForm email={variables?.email} />;

  if (isError) {
    return (
      <InfoBox
        content="Sie sind momentan nicht berechtigt einen Account für Open-Decision zu
      erstellen."
        title="Nicht berechtigt"
        variant="info"
      />
    );
  }

  return (
    <Form.Root
      state={formState}
      css={{ display: "flex", flexDirection: "column" }}
    >
      <Form.Field Label="Mailadresse">
        <Form.Input
          css={{ layer: "2" }}
          type="email"
          required
          name={formState.names.email}
          placeholder="beispiel@web.de"
        />
      </Form.Field>
      <Form.Submit isLoading={isLoading} css={{ marginTop: "$6" }}>
        Jetzt Registrieren
      </Form.Submit>
    </Form.Root>
  );
}

function RegisterForm({ email }: { email?: string }) {
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
        password: error?.errors?.body?.password?._errors[0],
        email: error?.errors?.body?.email?._errors[0],
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
    reset();
    if (formState.values.password !== formState.values.passwordConfirmation)
      formState.setError(
        formState.names.passwordConfirmation,
        "Die Passwörter stimmen nicht überein."
      );
  });

  return (
    <Form.Root state={formState} resetOnSubmit={false}>
      <Form.Field Label="Mailadresse">
        <Form.Input
          css={{ layer: "2" }}
          name={formState.names.email}
          type="email"
          disabled={!!email}
          placeholder="beispiel@web.de"
          required
          data-test="email"
        />
      </Form.Field>
      <Form.Field Label="Passwort" css={{ marginTop: "$4" }}>
        <Form.Input
          css={{ layer: "2" }}
          type="password"
          name={formState.names.password}
          placeholder="*******"
          required
          data-test="password"
        />
      </Form.Field>
      <Form.Field Label="Passwort wiederholen" css={{ marginTop: "$4" }}>
        <Form.Input
          css={{ layer: "2" }}
          type="password"
          name={formState.names.passwordConfirmation}
          required
          placeholder="*******"
          data-test="passwordConfirmation"
        />
      </Form.Field>
      <Stack css={{ gap: "$2", marginTop: "$4" }}>
        <Stack>
          <Row css={{ alignItems: "center", gap: "$2" }}>
            <Form.Checkbox
              formState={formState}
              name={formState.names.privacy}
              required
              data-test="privacy"
            />
            <Box as="span" css={{ lineHeight: "2px" }}>
              <Form.Label
                css={{ display: "inline" }}
                size="small"
                name={formState.names.privacy}
              >
                Ich habe die
              </Form.Label>{" "}
              <InternalLink
                href="https://open-decision.org/privacy"
                target="_blank"
                size="small"
              >
                Datenschutzerklärung
              </InternalLink>{" "}
              <Form.Label
                css={{ display: "inline" }}
                size="small"
                name={formState.names.privacy}
              >
                gelesen und stimme ihr zu.
              </Form.Label>
            </Box>
          </Row>
          <Form.Error
            name={formState.names.privacy}
            css={{ marginTop: "$2" }}
          />
        </Stack>
        <Row css={{ alignItems: "center", gap: "$2" }}>
          <Form.Checkbox
            formState={formState}
            name={formState.names.legal}
            required
            data-test="legal"
          />
          <Form.Label
            css={{ display: "inline" }}
            size="small"
            name={formState.names.privacy}
          >
            Ich habe zur Kenntnis genommen, dass sich die Software in einer
            frühen Entwicklungsphase befindet und ein fehlerfreier Betrieb nicht
            garantiert werden kann.
          </Form.Label>
        </Row>
      </Stack>
      {isError ? (
        <ErrorMessage data-test="error" css={{ marginTop: "$4" }}>
          {error.message}
        </ErrorMessage>
      ) : null}
      <Form.Submit
        data-test="submit"
        isLoading={isLoading}
        css={{ marginTop: "$4" }}
        type="submit"
      >
        Jetzt Registrieren
      </Form.Submit>
    </Form.Root>
  );
}
