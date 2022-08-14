import * as React from "react";
import { Form, Dialog, DialogTriggerProps } from "@open-decision/design-system";
import { useTreeAPI } from "../../../Data/useTreeAPI";
import { useTranslations } from "next-intl";

type Props = DialogTriggerProps & {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  focusOnClose?: () => void;
};

export const CreateTreeDialog = ({
  children,
  focusOnClose,
  open,
  setOpen,
}: Props) => {
  const t = useTranslations("common.createTreeDialog");
  const formState = Form.useFormState({ defaultValues: { treeName: "" } });
  const { mutate: createTree, isLoading } = useTreeAPI().useCreate({
    onSuccess: () => setOpen?.(false),
  });

  formState.useSubmit(() => {
    createTree({ body: { name: formState.values.treeName } });
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Content onCloseAutoFocus={focusOnClose}>
        <Dialog.Header css={{ marginBottom: "$4" }}>{t("title")}</Dialog.Header>
        <Form.Root
          validateOnBlur={false}
          state={formState}
          css={{ display: "flex", flexDirection: "column" }}
        >
          <Form.Field
            Label={
              <Dialog.Description>
                {t("treeNameInput.label")}
              </Dialog.Description>
            }
          >
            <Form.Input name={formState.names.treeName} required autoFocus />
          </Form.Field>
          <Dialog.ButtonRow isLoading={isLoading} colorScheme="success">
            {t("submit")}
          </Dialog.ButtonRow>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
};
