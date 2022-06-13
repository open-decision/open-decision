import { Form, ErrorMessage } from "@open-decision/design-system";
import { useAuth } from "../../useAuth";
import { useMutation, UseMutationOptions } from "react-query";
import axios from "axios";
import { InfoBox } from "../../../Notifications/InfoBox";

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

  if (isSuccess && variables?.email)
    return <RegisterForm email={variables.email} />;

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

function RegisterForm({ email }: { email: string }) {
  const formState = Form.useFormState({
    defaultValues: {
      email,
      password: "",
      passwordConfirmation: "",
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
          disabled
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
