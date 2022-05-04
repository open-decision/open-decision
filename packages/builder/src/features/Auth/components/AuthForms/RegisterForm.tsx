import {
  useForm,
  Field,
  Input,
  ErrorMessage,
  SubmitButton,
  Text,
} from "@open-decision/design-system";
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
        url: `/api/users/is-whitelisted`,
        data,
        method: "POST",
      });

      if (!result.data.isWhitelisted) throw new Error();

      return result.data;
    },
    { ...options }
  );

export function RegisterForm() {
  const [EmailForm, { register: registerEmailForm }] = useForm({
    defaultValues: {
      email: "",
    },
  });

  const [state, send] = useAuth();
  const { mutate, isSuccess, isError, isLoading, variables } =
    useIsOnWhiteListQuery();

  console.log(isSuccess);

  const [RegisterForm, { register }] = useForm({
    defaultValues: {
      email: variables?.email ?? "",
      password: "",
      passwordConfirmation: "",
    },
  });

  if (isSuccess)
    return (
      <RegisterForm
        onSubmit={({ email, password }) =>
          send({ type: "REGISTER", email, password })
        }
      >
        <Field label="Mailadresse">
          <Input
            css={{ layer: "2" }}
            {...registerEmailForm("email", {
              disabled: true,
            })}
            placeholder="beispiel@web.de"
          />
        </Field>
        <Field label="Passwort" css={{ marginTop: "$4" }}>
          <Input
            css={{ layer: "2" }}
            type="password"
            {...register("password", {
              required: {
                value: true,
                message: "Ein Passwort muss angegeben werden.",
              },
            })}
            placeholder="*******"
          />
        </Field>
        <Field label="Passwort wiederholen" css={{ marginTop: "$4" }}>
          <Input
            css={{ layer: "2" }}
            type="password"
            {...register("passwordConfirmation", {
              required: {
                value: true,
                message:
                  "Sie müssen ihr Passwort erneut eingeben um Rechtschreibfehlern vorzubeugen.",
              },
              deps: "password",
            })}
            placeholder="*******"
          />
        </Field>
        {state.context.error ? (
          <ErrorMessage css={{ marginBlock: "$2" }}>
            {state.context.error}
          </ErrorMessage>
        ) : null}
        <SubmitButton
          isLoading={isLoading}
          css={{ marginTop: "$6" }}
          type="submit"
        >
          Jetzt Registrieren
        </SubmitButton>
      </RegisterForm>
    );

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
    <EmailForm
      onSubmit={({ email }) => mutate({ email })}
      css={{ display: "flex", flexDirection: "column" }}
    >
      <Field label="Mailadresse">
        <Input
          css={{ layer: "2" }}
          {...registerEmailForm("email", {
            required: {
              value: true,
              message: "Eine E-Mail Addresse muss angegeben werden.",
            },
          })}
          placeholder="beispiel@web.de"
        />
      </Field>
      {state.context.error ? (
        <ErrorMessage css={{ marginBlock: "$2" }}>
          {state.context.error}
        </ErrorMessage>
      ) : null}
      <SubmitButton
        isLoading={isLoading}
        css={{ marginTop: "$6" }}
        type="submit"
      >
        Jetzt Registrieren
      </SubmitButton>
    </EmailForm>
  );
}
