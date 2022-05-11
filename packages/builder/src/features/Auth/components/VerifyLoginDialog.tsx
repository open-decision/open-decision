import * as React from "react";
import {
  Dialog,
  DialogTriggerProps,
  Form,
  Text,
  ErrorMessage,
} from "@open-decision/design-system";
import { useVerifyLogin } from "../verifyLogin/useVerifyLogin";
import { InfoBox, InfoBoxProps } from "../../Notifications/InfoBox";
import { ColorKeys } from "@open-decision/design-system/src/internal/utils";

export type VerfiyLoginDialogProps = DialogTriggerProps & {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  focusOnClose?: () => void;
  description?: React.ReactNode;
  onVerify: (verified: boolean) => void;
  onClose?: () => void;
  colorScheme?: ColorKeys;
  additionalMessage?: InfoBoxProps;
};

export function VerifyLoginDialog({
  children,
  open,
  setOpen,
  focusOnClose,
  onVerify,
  onClose,
  colorScheme = "success",
  description = "Bitte bestätigen Sie ihre Identität.",
  additionalMessage,
}: VerfiyLoginDialogProps) {
  const [email, state, send] = useVerifyLogin(onVerify);

  const formState = Form.useFormState({
    defaultValues: {
      email,
      password: "",
    },
  });

  formState.useSubmit(() => {
    send({ type: "VERIFY_LOGIN", password: formState.values.password });
  });

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        setOpen?.(open);
        !open && onClose?.();
      }}
    >
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Content
        onCloseAutoFocus={focusOnClose}
        Above={
          additionalMessage ? <InfoBox {...additionalMessage} /> : undefined
        }
      >
        <Dialog.Header css={{ marginBottom: "$2" }}>
          Passwort verifizieren
        </Dialog.Header>
        <Dialog.Description asChild>
          {typeof description === "string" ? (
            <Text>{description}</Text>
          ) : (
            description
          )}
        </Dialog.Description>
        <Form.Root
          state={formState}
          css={{
            marginTop: "$4",
          }}
        >
          <Form.Field state={formState} label="E-Mail">
            <Form.Input disabled name={formState.names.email} type="email" />
          </Form.Field>
          <Form.Field state={formState} label="Passwort">
            <Form.Input
              autoFocus
              name={formState.names.password}
              required
              placeholder="*****"
              type="password"
            />
          </Form.Field>
          {state.context.Error ? (
            <ErrorMessage css={{ marginTop: "$2" }}>
              {state.context.Error.message}
            </ErrorMessage>
          ) : null}
          <Dialog.ButtonRow
            isLoading={state.matches("verifingLogin")}
            colorScheme={colorScheme}
          >
            Bestätigen
          </Dialog.ButtonRow>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}
