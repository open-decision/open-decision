import { Form, ErrorMessage, Text } from "@open-decision/design-system";
import { useAuth } from "../../useAuth";
import { useMutation, UseMutationOptions } from "react-query";
import axios from "axios";
import { InfoBox } from "../../../Notifications/InfoBox";
import { InternalLink } from "../../../../components/InternalLink";

type Data = { email: string };

const useIsOnWhiteListQuery = (
  options?: UseMutationOptions<unknown, unknown, Data>
) =>
  useMutation(
    "isOnWhiteList",
    async (data: Data) => {
      const result = await axios({
        url: `/external-api/users/is-whitelisted`,
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
      <Form.Field label="Mailadresse">
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

  formState.useSubmit(() => {
    send({
      type: "REGISTER",
      email: formState.values.email,
      password: formState.values.password,
    });
  });

  formState.useValidate(() => {
    if (formState.values.password !== formState.values.passwordConfirmation)
      formState.setError(
        formState.names.passwordConfirmation,
        "Die Passwörter stimmen nicht überein."
      );
  });

  const [state, send] = useAuth();

  return (
    <Form.Root state={formState}>
      <Form.Field label="Mailadresse">
        <Form.Input
          css={{ layer: "2" }}
          name={formState.names.email}
          type="email"
          disabled={!!email}
          placeholder="beispiel@web.de"
        />
      </Form.Field>
      <Form.Field label="Passwort" css={{ marginTop: "$4" }}>
        <Form.Input
          css={{ layer: "2" }}
          type="password"
          name={formState.names.password}
          placeholder="*******"
        />
      </Form.Field>
      <Form.Field label="Passwort wiederholen" css={{ marginTop: "$4" }}>
        <Form.Input
          css={{ layer: "2" }}
          type="password"
          name={formState.names.passwordConfirmation}
          required
          placeholder="*******"
        />
      </Form.Field>
      <Form.Field
        customLabel
        label={
          <Text size="small">
            <Form.Label
              css={{ display: "inline", textStyle: "inherit" }}
              name="legal"
            >
              Ich habe die
            </Form.Label>{" "}
            <InternalLink
              href="https://open-decision.org/privacy"
              target="_blank"
              css={{ textStyle: "inherit" }}
            >
              Datenschutzerklärung
            </InternalLink>{" "}
            <Form.Label
              css={{ display: "inline", textStyle: "inherit" }}
              name="legal"
            >
              gelesen und stimme ihr zu.
            </Form.Label>
          </Text>
        }
        layout="inline-right"
        css={{ marginTop: "$4" }}
      >
        <Form.Checkbox name="privacy" required />
      </Form.Field>
      <Form.Field
        customLabel
        label={
          <Text size="small">
            <Form.Label
              css={{ display: "inline", textStyle: "inherit" }}
              name="legal"
            >
              Ich habe den
            </Form.Label>{" "}
            <InternalLink
              href="https://open-decision.org/disclaimer"
              target="_blank"
              css={{ textStyle: "inherit" }}
            >
              Haftungsausschluss
            </InternalLink>{" "}
            <Form.Label
              css={{ display: "inline", textStyle: "inherit" }}
              name="legal"
            >
              zur Kenntnis genommen und bin damit einverstanden.
            </Form.Label>
          </Text>
        }
        layout="inline-right"
      >
        <Form.Checkbox name="legal" required />
      </Form.Field>
      {state.context.error ? (
        <ErrorMessage css={{ marginBlock: "$2" }}>
          {state.context.error}
        </ErrorMessage>
      ) : null}
      <Form.Submit
        isLoading={state.matches("loggedOut.register")}
        css={{ marginTop: "$6" }}
        type="submit"
      >
        Jetzt Registrieren
      </Form.Submit>
    </Form.Root>
  );
}
