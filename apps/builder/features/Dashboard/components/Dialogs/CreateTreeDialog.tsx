import * as React from "react";
import { Form, Dialog, DialogTriggerProps } from "@open-decision/design-system";
import { useTreeAPI } from "../../../Data/useTreeAPI";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const t = useTranslations("common.createTreeDialog");
  const formState = Form.useFormState({ defaultValues: { treeName: "" } });

  const { mutate: createTree, isLoading } = useTreeAPI().useCreate({
    onSuccess: ({ data: { uuid } }) => {
      return router.push(`/builder/${uuid}`);
    },
  });

  formState.useSubmit(async () => {
    createTree({ body: { name: formState.values.treeName } });
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Content onCloseAutoFocus={focusOnClose}>
          <Dialog.Header css={{ marginBottom: "$4" }}>
            {t("title")}
          </Dialog.Header>
          <Form.Root
            resetOnSubmit={false}
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
              <Form.Input
                name={formState.names.treeName}
                required
                placeholder={t("treeNameInput.placeholder")}
              />
            </Form.Field>
            <Dialog.ButtonRow isLoading={isLoading} colorScheme="success">
              {t("submit")}
            </Dialog.ButtonRow>
          </Form.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
