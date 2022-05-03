import * as React from "react";
import { Heading, SubmitButton } from "@open-decision/design-system";
import { Card } from "../../components/Card";
import { useDeleteUserMutation } from "../Auth/settings.queries";
import { VerifiedSettingsChange } from "./VerifiedSettingsChange";
import { useAuth } from "../Auth/useAuth";

export function DeleteAccount() {
  const [, send] = useAuth();
  const { mutate, isLoading } = useDeleteUserMutation({
    onSuccess: () => {
      send("LOG_OUT");
    },
  });

  const [open, setOpen] = React.useState(false);

  return (
    <VerifiedSettingsChange
      onVerify={(isVerified) => isVerified && mutate()}
      open={open}
      setOpen={setOpen}
      description="Bitte verifizieren Sie sich um Ihren Account zu löschen."
      additionalMessage={{
        variant: "danger",
        title: "Achtung!",
        content: "Dies kann nicht rückgängig gemacht werden.",
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
          Account löschen
        </Heading>
        <SubmitButton
          onClick={() => setOpen(true)}
          isLoading={isLoading}
          colorScheme="danger"
          variant="secondary"
        >
          Account löschen
        </SubmitButton>
      </Card>
    </VerifiedSettingsChange>
  );
}
