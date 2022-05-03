import * as React from "react";
import {
  buttonStyles,
  Dialog,
  Field,
  Input,
  Link,
  Text,
  useForm,
  SubmitButton,
  Stack,
  DialogTriggerProps,
  StyleObject,
} from "@open-decision/design-system";
import { readableDate } from "features/Dashboard/utils";
import { useGetTreeNameQuery } from "features/Data/generated/graphql";
import { useTreeId } from "features/Data/useTreeId";
import { ErrorBoundary } from "@sentry/nextjs";
import { useMutation } from "react-query";
import { useTreeContext } from "../state/treeStore/TreeContext";

function createFile(data: object) {
  return new Blob([JSON.stringify(data)], { type: "application/json" });
}

type Props = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  focusOnClose?: () => void;
  className?: string;
  children?: DialogTriggerProps["children"];
  css?: StyleObject;
};

export function ExportDialog({
  children,
  open,
  setOpen,
  focusOnClose,
  className,
  css,
}: Props) {
  const uuid = useTreeId();
  const { getTree } = useTreeContext();
  const { data } = useGetTreeNameQuery({ uuid });

  const [fileName, setFileName] = React.useState("");
  const {
    mutate,
    data: file,
    isLoading,
    reset,
  } = useMutation(() => {
    return new Promise<Blob>((resolve) => {
      const tree = getTree();

      return setTimeout(
        () => resolve(createFile({ name: data?.decisionTree?.name, ...tree })),
        2000
      );
    });
  });

  const [Form, { register }] = useForm({
    defaultValues: {
      name: data?.decisionTree?.name
        ? `${data?.decisionTree?.name}_${readableDate(new Date())}`
        : "",
    },
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {children ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Dialog.Content
        className={className}
        css={css}
        onCloseAutoFocus={focusOnClose}
      >
        <Dialog.Header>Projekt exportieren</Dialog.Header>
        <ErrorBoundary fallback={ExportErrorFallback}>
          {!file ? (
            <>
              <Dialog.Description asChild>
                <Text css={{ marginTop: "$2" }}>
                  Nehmen Sie Anpassungen am Export vor.
                </Text>
              </Dialog.Description>
              <Form
                onSubmit={({ name }) => {
                  setFileName(name);
                  mutate();
                }}
                css={{ marginTop: "$4" }}
              >
                <Field label="Dateiname">
                  <Input {...register("name")} />
                </Field>
                <SubmitButton
                  isLoading={isLoading}
                  css={{ marginTop: "$2", marginLeft: "auto" }}
                >
                  Weiter
                </SubmitButton>
              </Form>
            </>
          ) : (
            <Stack>
              <Dialog.Description asChild>
                <Text css={{ marginTop: "$2" }}>
                  Speichern Sie ihren exportierten Baum.
                </Text>
              </Dialog.Description>
              <Link
                className={buttonStyles({
                  css: { marginTop: "$4", alignSelf: "flex-end" },
                })}
                download={`${fileName}.json`}
                href={URL.createObjectURL(file)}
                onClick={() => {
                  reset();
                  setOpen?.(false);
                }}
              >
                Speichern
              </Link>
            </Stack>
          )}
        </ErrorBoundary>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function ExportErrorFallback() {
  return <Text>Beim Export ihres Baumes ist ein Fehler aufgetreten.</Text>;
}
