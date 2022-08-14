import {
  Form,
  Dialog,
  DialogTriggerProps,
  Text,
  styled,
  StyleObject,
} from "@open-decision/design-system";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useTreeAPI } from "../../../Data/useTreeAPI";

const Bold = styled("span", { color: "$gray12" });

type Props = {
  tree: { name: string; uuid: string };
  open?: boolean;
  setOpen?: (open: boolean) => void;
  focusOnClose?: () => void;
  className?: string;
  children?: DialogTriggerProps["children"];
  css?: StyleObject;
  onDelete?: () => void;
  onDeleteAsync?: () => Promise<any>;
};

export function DeleteTreeDialog({
  tree,
  open,
  setOpen,
  focusOnClose,
  children,
  className,
  css,
  onDelete,
  onDeleteAsync,
}: Props) {
  const t = useTranslations("common.deleteTreeDialog");
  const formState = Form.useFormState({
    defaultValues: { treeName: "" },
  });

  const { mutate: deleteTree, isLoading } = useTreeAPI().useDelete({
    onSuccess: onDelete,
  });

  formState.useSubmit(async () => {
    await deleteTree(
      { params: { uuid: tree.uuid } },
      {
        onSuccess: () => {
          setOpen?.(false);
          onDeleteAsync?.();
        },
      }
    );
  });

  formState.useValidate(() => {
    if (tree.name !== formState.values.treeName)
      formState.setError(
        formState.names.treeName,
        "Der Projektname ist nicht korrekt"
      );
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Content
        onCloseAutoFocus={focusOnClose}
        className={className}
        css={css}
      >
        <Dialog.Header css={{ marginBottom: "$2" }}>{t("title")}</Dialog.Header>
        <Dialog.Description asChild>
          <Text css={{ marginBottom: "$4", color: "$gray11" }}>
            {t.rich("description", {
              treeName: tree.name,
              bold: (children) => <Bold>{children}</Bold>,
            })}
          </Text>
        </Dialog.Description>
        <Form.Root state={formState} validateOnBlur={false}>
          <Form.Field Label={t("treeNameInput.label")}>
            <Form.Input
              name={formState.names.treeName}
              required
              placeholder={tree.name}
            />
          </Form.Field>
          <Dialog.ButtonRow isLoading={isLoading} colorScheme="danger">
            {t("submit")}
          </Dialog.ButtonRow>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}
