import * as React from "react";
import { Heading, Form } from "@open-decision/design-system";
import { Card } from "../../components/Card";
import { useUserUpdateMutation } from "../Auth/settings.queries";
import { VerifiedSettingsChange } from "./VerifiedSettingsChange";
import { TGetUserOutput } from "@open-decision/user-api-specification";

type Props = { user: TGetUserOutput };

export function ChangeEmail({ user }: Props) {
  const formState = Form.useFormState({
    defaultValues: {
      newEmail: "",
    },
  });

  formState.useSubmit(() => {
    setOpen(true);
  });

  const { mutate, isLoading } = useUserUpdateMutation({
    onError: (error) => {
      formState.setErrors({ newEmail: error.message });
    },
  });

  const [open, setOpen] = React.useState(false);

  return (
    <VerifiedSettingsChange
      email={user.email}
      onVerify={() => {
        mutate({ email: formState.values.newEmail });
        setOpen(false);
      }}
      open={open}
      setOpen={setOpen}
    >
      <Card>
        <Heading as="h3" size="small">
          E-Mail ändern
        </Heading>
        <Form.Root state={formState} resetOnSubmit={false}>
          <Form.Field Label="Neue E-Mail Adresse">
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
