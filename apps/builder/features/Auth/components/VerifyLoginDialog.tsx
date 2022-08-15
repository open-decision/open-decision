import * as React from "react";
import {
  Dialog,
  DialogTriggerProps,
  Form,
  Text,
} from "@open-decision/design-system";
import { InfoBox, InfoBoxProps } from "../../Notifications/InfoBox";
import { ColorKeys } from "@open-decision/design-system";
import {
  createVerifyLoginMachine,
  onVerify,
  onVerifyFailure,
} from "../verifyLogin/verifyLogin.machine";
import { useMachine } from "@xstate/react";
import { useTranslations } from "next-intl";
import { EmailField } from "../../../components/EmailInput";
import { PasswordInput } from "../../../components/PasswordInput";
import { ErrorMessage } from "../../../components/Error/ErrorMessage";

export type VerfiyLoginDialogProps = DialogTriggerProps & {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  focusOnClose?: () => void;
  description?: React.ReactNode;
  onVerify: onVerify;
  onVerifyFailure?: onVerifyFailure;
  onClose?: () => void;
  colorScheme?: ColorKeys;
  additionalMessage?: InfoBoxProps;
  email: string;
};

export function VerifyLoginDialog({
  children,
  open,
  setOpen,
  focusOnClose,
  onVerify,
  onVerifyFailure,
  onClose,
  colorScheme = "success",
  description,
  additionalMessage,
  email,
}: VerfiyLoginDialogProps) {
  const t = useTranslations("common.verifyLogin");
  const [state, send] = useMachine(
    createVerifyLoginMachine(email, onVerify, onVerifyFailure)
  );

  const formState = Form.useFormState({
    defaultValues: {
      email,
      password: "",
    },
  });

  formState.useSubmit(() => {
    send({ type: "VERIFY_LOGIN", password: formState.values.password });
  });

  const definedDescription = description ?? t("descriptionFallback");

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
          {typeof definedDescription === "string" ? (
            <Text>{definedDescription}</Text>
          ) : (
            definedDescription
          )}
        </Dialog.Description>
        <Form.Root state={formState} css={{ marginTop: "$4" }}>
          <EmailField name={formState.names.email} disabled />
          <PasswordInput autoFocus name={formState.names.password} />
          {state.context.Error ? (
            <ErrorMessage
              css={{ marginTop: "$2" }}
              code={state.context.Error.code}
            />
          ) : null}
          <Dialog.ButtonRow
            isLoading={state.matches("verifingLogin")}
            colorScheme={colorScheme}
          >
            {t("submit")}
          </Dialog.ButtonRow>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}
