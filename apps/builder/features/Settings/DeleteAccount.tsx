import * as React from "react";
import { Heading, SubmitButton } from "@open-decision/design-system";
import { Card } from "../../components/Card";
import { VerifiedSettingsChange } from "./VerifiedSettingsChange";
import { TGetUserOutput } from "@open-decision/user-api-specification";
import { useUser } from "../Auth/useUserQuery";
import { useTranslations } from "next-intl";

type Props = { user: TGetUserOutput };

export function DeleteAccount({ user }: Props) {
  const t = useTranslations("settings.account.deleteAccount");
  const { mutate, isLoading } = useUser().useDeleteUserMutation();

  const [open, setOpen] = React.useState(false);

  return (
    <VerifiedSettingsChange
      email={user.email}
      onVerify={() => mutate()}
      open={open}
      setOpen={setOpen}
      description={t("verifyOverlay.description")}
      additionalMessage={{
        variant: "danger",
        title: t("verifyOverlay.additionalMessage.title"),
        content: t("verifyOverlay.additionalMessage.content"),
        css: {
          backgroundColor: "$danger2",
        },
      }}
      colorScheme="danger"
    >
      <Card
        css={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Heading as="h3" size="small">
          {t("title")}
        </Heading>
        <SubmitButton
          onClick={() => setOpen(true)}
          isLoading={isLoading}
          colorScheme="danger"
          variant="secondary"
        >
          {t("submit")}
        </SubmitButton>
      </Card>
    </VerifiedSettingsChange>
  );
}
