import * as React from "react";
import { Heading, Form } from "@open-decision/design-system";
import { Card } from "../../components/Card";
import { VerifiedSettingsChange } from "./VerifiedSettingsChange";
import { TGetUserOutput } from "@open-decision/user-api-specification";
import { useNotificationStore } from "../Notifications/NotificationState";
import { useUser } from "../Auth/useUserQuery";
import { EmailField } from "../../components/EmailInput";
import { useTranslations } from "next-intl";

type Props = { user: TGetUserOutput };

export function ChangeEmail({ user }: Props) {
  const t = useTranslations("settings.account.changeEmail");
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
        title: t("success.title"),
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
          {t("title")}
        </Heading>
        <Form.Root state={formState} resetOnSubmit={false}>
          <EmailField name={formState.names.newEmail} />
          <Form.Submit
            isLoading={isLoading}
            variant="secondary"
            css={{ marginLeft: "auto", marginTop: "$3" }}
          >
            {t("submit")}
          </Form.Submit>
        </Form.Root>
      </Card>
    </VerifiedSettingsChange>
  );
}
