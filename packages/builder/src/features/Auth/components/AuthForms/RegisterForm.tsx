import {
  useForm,
  Field,
  Input,
  ErrorMessage,
  SubmitButton,
} from "@open-decision/design-system";
import { useAuth } from "../../useAuth";

export function RegisterForm() {
  const [Form, { register }] = useForm({
    defaultValues: {
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const [state, send] = useAuth();

  return (
    <Form
      onSubmit={({ email, password }) =>
        send({ type: "REGISTER", email, password })
      }
      css={{ display: "flex", flexDirection: "column" }}
    >
      <Field label="Mailadresse">
        <Input
          css={{ layer: "2" }}
          {...register("email", {
            required: {
              value: true,
              message: "Eine E-Mail Addresse muss angegeben werden.",
            },
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
          {...register("password_confirmation", {
            required: {
              value: true,
              message:
                "Sie müssen ihr Passwort erneut eingeben um Rechtschreibfehlern vorzubeugen.",
            },
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
        isLoading={state.matches("loggedOut.register")}
        css={{ marginTop: "$6" }}
        type="submit"
      >
        Jetzt Registrieren
      </SubmitButton>
    </Form>
  );
}
