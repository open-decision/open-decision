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

export function ChangeEmail() {
  const [PasswordForm, { register: registerPasswordForm }] = useForm({
    defaultValues: {
      newEmail: "",
    },
  });

  const [newEmail, setNewEmail] = React.useState<string | undefined>(undefined);

  const { mutate, isLoading } = useUserUpdateMutation();
  const [open, setOpen] = React.useState(false);

  return (
    <VerifiedSettingsChange
      onVerify={() => mutate({ email: newEmail })}
      open={open}
      setOpen={setOpen}
    >
      <Card>
        <Heading as="h3" size="small">
          E-Mail ändern
        </Heading>
        <PasswordForm
          onSubmit={({ newEmail }) => {
            setNewEmail(newEmail);
            setOpen(true);
          }}
        >
          <Field label="Neue E-Mail Adresse">
            <Input
              {...registerPasswordForm("newEmail", {
                required: {
                  value: true,
                  message: "Eine E-Mail-Adresse muss angegeben werden.",
                },
              })}
              type="email"
              placeholder="max.mustermann@gmx.de"
            />
          </Field>
          <SubmitButton
            isLoading={isLoading}
            variant="secondary"
            css={{ marginLeft: "auto", marginTop: "$3" }}
          >
            E-Mail ändern
          </SubmitButton>
        </PasswordForm>
      </Card>
    </VerifiedSettingsChange>
  );
}
