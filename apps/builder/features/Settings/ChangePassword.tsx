import * as React from "react";
import { Heading, Form, addNotification } from "@open-decision/design-system";
import { cardClasses } from "../../components/Card";
import { VerifiedSettingsChange } from "./VerifiedSettingsChange";
import { TGetUserOutput } from "@open-decision/api-specification";
import { useTranslations } from "next-intl";
import { PasswordInput } from "../../components/PasswordInput";
import { APIClient } from "@open-decision/api-client";
import { useUser } from "@open-decision/api-react-binding";

type Props = { user: TGetUserOutput };

export function ChangePassword({ user }: Props) {
  const t = useTranslations("settings.account.changePassword");
  const methods = Form.useForm({
    defaultValues: {
      newPassword: "",
    },
  });

  const { mutate, isLoading } = useUser(APIClient).useUserUpdateMutation({
    onError: (error: any) => {
      methods.setError("newPassword", {
        message: error.errors?.body?.password?._errors[0],
      });
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
        const newPassword = methods.watch("newPassword");

        mutate({ password: newPassword });
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
          <PasswordInput
            {...methods.register("newPassword", { required: true })}
            customLabel={t("inputLabel")}
          />
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
