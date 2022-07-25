import * as React from "react";
import { Heading, Form } from "@open-decision/design-system";
import { Card } from "../../components/Card";
import { VerifiedSettingsChange } from "./VerifiedSettingsChange";
import { TGetUserOutput } from "@open-decision/user-api-specification";
import { useNotificationStore } from "../Notifications/NotificationState";
import { useUser } from "../Auth/useUserQuery";

type Props = { user: TGetUserOutput };

export function ChangeEmail({ user }: Props) {
  const { addNotification } = useNotificationStore();
  const formState = Form.useFormState({
    defaultValues: {
      newEmail: "",
    },
  });

  formState.useSubmit(() => {
    setOpen(true);
  });

  const { mutate, isLoading } = useUser().useUserUpdateMutation({
    onError: (error) => {
      formState.setErrors({ newEmail: error.message });
    },
    onSuccess: () => {
      addNotification({
        title: "E-Mail Adresse erfolgreich geändert",
        variant: "success",
      });
      formState.reset();
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
