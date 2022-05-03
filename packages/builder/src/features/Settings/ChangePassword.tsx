import * as React from "react";
import {
  Heading,
  Field,
  Input,
  SubmitButton,
  useForm,
} from "@open-decision/design-system";
import { Card } from "../../components/Card";
import { useUserUpdateMutation } from "../Auth/settings.queries";
import { VerifiedSettingsChange } from "./VerifiedSettingsChange";

export function ChangePassword() {
  const [PasswordForm, { register: registerPasswordForm }] = useForm({
    defaultValues: {
      newPassword: "",
    },
  });

  const [newPassword, setNewPassword] = React.useState<string | undefined>(
    undefined
  );

  const { mutate, isLoading } = useUserUpdateMutation();
  const [open, setOpen] = React.useState(false);

  return (
    <VerifiedSettingsChange
      onVerify={() => mutate({ password: newPassword })}
      open={open}
      setOpen={setOpen}
    >
      <Card>
        <Heading as="h3" size="small">
          Passwort ändern
        </Heading>
        <PasswordForm
          onSubmit={({ newPassword }) => {
            setNewPassword(newPassword);
            setOpen(true);
          }}
        >
          <Field label="Neues Passwort">
            <Input
              {...registerPasswordForm("newPassword", {
                required: {
                  value: true,
                  message: "Ein Passwort muss angegeben werden.",
                },
              })}
              type="password"
              placeholder="********"
            />
          </Field>
          <SubmitButton
            isLoading={isLoading}
            variant="secondary"
            css={{ marginLeft: "auto", marginTop: "$3" }}
          >
            Passwort ändern
          </SubmitButton>
        </PasswordForm>
      </Card>
    </VerifiedSettingsChange>
  );
}
