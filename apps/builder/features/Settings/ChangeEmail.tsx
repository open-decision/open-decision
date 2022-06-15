import * as React from "react";
import { Heading, Form } from "@open-decision/design-system";
import { Card } from "../../components/Card";
import { useUserUpdateMutation } from "../Auth/settings.queries";
import { VerifiedSettingsChange } from "./VerifiedSettingsChange";

export function ChangeEmail() {
  const formState = Form.useFormState({
    defaultValues: {
      newEmail: "",
    },
  });

  formState.useSubmit(() => {
    setNewEmail(formState.values.newEmail);
    setOpen(true);
  });

  const [newEmail, setNewEmail] = React.useState<string | undefined>(undefined);

  const { mutate, isLoading } = useUserUpdateMutation();
  const [open, setOpen] = React.useState(false);

  const handleVerify = React.useCallback(() => mutate({ email: newEmail }), []);

  return (
    <VerifiedSettingsChange
      onVerify={handleVerify}
      open={open}
      setOpen={setOpen}
    >
      <Card>
        <Heading as="h3" size="small">
          E-Mail ändern
        </Heading>
        <Form.Root state={formState}>
          <Form.Field label="Neue E-Mail Adresse">
            <Form.Input
              name={formState.names.newEmail}
              required
              type="email"
              placeholder="max.mustermann@gmx.de"
            />
          </Form.Field>
          <Form.Submit
            isLoading={isLoading}
            variant="secondary"
            css={{ marginLeft: "auto", marginTop: "$3" }}
          >
            E-Mail ändern
          </Form.Submit>
        </Form.Root>
      </Card>
    </VerifiedSettingsChange>
  );
}
