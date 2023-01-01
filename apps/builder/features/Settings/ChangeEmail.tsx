import * as React from "react";
import { Heading, Form, addNotification } from "@open-decision/design-system";
import { cardClasses } from "../../components/Card";
import { VerifiedSettingsChange } from "./VerifiedSettingsChange";
import { TGetUserOutput } from "@open-decision/api-specification";
import { useUser } from "../Auth/useUserQuery";
import { EmailField } from "../../components/EmailInput";
import { useTranslations } from "next-intl";

type Props = { user: TGetUserOutput };

export function ChangeEmail({ user }: Props) {
  const t = useTranslations("settings.account.changeEmail");
  const methods = Form.useForm({
    defaultValues: {
      newEmail: "",
    },
  });

  const { mutate, isLoading } = useUser().useUserUpdateMutation({
    onError: (error) => {
      methods.setError("newEmail", { message: error.message });
    },
    onSuccess: () => {
      addNotification({
        title: t("success.title"),
        variant: "success",
      });
      methods.reset();
    },
  });

  const [open, setOpen] = React.useState(false);

  return (
    <VerifiedSettingsChange
      email={user.email}
      onVerify={() => {
        const newEmail = methods.getValues("newEmail");

        mutate({ email: newEmail });
        setOpen(false);
      }}
      open={open}
      setOpen={setOpen}
    >
      <div className={cardClasses()}>
        <Heading as="h3" size="small">
          {t("title")}
        </Heading>
        <Form.Root
          methods={methods}
          onSubmit={methods.handleSubmit(() => setOpen(true))}
        >
          <EmailField />
          <Form.SubmitButton
            isLoading={isLoading}
            variant="secondary"
            className="ml-auto mt-3"
          >
            {t("submit")}
          </Form.SubmitButton>
        </Form.Root>
      </div>
    </VerifiedSettingsChange>
  );
}
