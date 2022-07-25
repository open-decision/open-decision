import * as React from "react";
import { Heading, Form } from "@open-decision/design-system";
import { Card } from "../../components/Card";
import { VerifiedSettingsChange } from "./VerifiedSettingsChange";
import { TGetUserOutput } from "@open-decision/user-api-specification";
import { useNotificationStore } from "../Notifications/NotificationState";
import { useUser } from "../Auth/useUserQuery";

type Props = { user: TGetUserOutput };

export function ChangePassword({ user }: Props) {
  const { addNotification } = useNotificationStore();
  const formState = Form.useFormState({
    defaultValues: {
      newPassword: "",
    },
  });

  formState.useSubmit(() => {
    setOpen(true);
  });

  const { mutate, isLoading } = useUser().useUserUpdateMutation({
    onError: (error) => {
      formState.setErrors({
        newPassword: error.errors?.body?.password?._errors[0],
      });
    },
    onSuccess: () => {
      addNotification({
        title: "Passwort erfolgreich geändert",
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
        mutate({ password: formState.values.newPassword });
        setOpen(false);
      }}
      open={open}
      setOpen={setOpen}
    >
      <Card>
        <Heading as="h3" size="small">
          Passwort ändern
        </Heading>
        <Form.Root state={formState} resetOnSubmit={false}>
          <Form.Field Label="Neues Passwort">
            <Form.Input
              name={formState.names.newPassword}
              required
              type="password"
              placeholder="********"
            />
          </Form.Field>
          <Form.Submit
            isLoading={isLoading}
            variant="secondary"
            css={{ marginLeft: "auto", marginTop: "$3" }}
          >
            Passwort ändern
          </Form.Submit>
        </Form.Root>
      </Card>
    </VerifiedSettingsChange>
  );
}
