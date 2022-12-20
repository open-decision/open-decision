import * as React from "react";
import {
  ColorKeys,
  Dialog,
  Form,
  InfoBox,
  InfoBoxProps,
  Text,
} from "@open-decision/design-system";
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

export type VerfiyLoginDialogProps = Dialog.TriggerProps & {
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

  const methods = Form.useForm({
    defaultValues: {
      email,
      password: "",
    },
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
        <Dialog.Header className="mb-2">Passwort verifizieren</Dialog.Header>
        <Dialog.Description asChild>
          {typeof definedDescription === "string" ? (
            <Text>{definedDescription}</Text>
          ) : (
            definedDescription
          )}
        </Dialog.Description>
        <Form.Root
          methods={methods}
          className="mt-4"
          onSubmit={methods.handleSubmit((values) =>
            send({ type: "VERIFY_LOGIN", password: values.password })
          )}
        >
          <EmailField disabled inputClassName="disabled:opacity-75" />
          <PasswordInput />
          {state.context.Error ? (
            <ErrorMessage className="mt-2" code={state.context.Error.code} />
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
