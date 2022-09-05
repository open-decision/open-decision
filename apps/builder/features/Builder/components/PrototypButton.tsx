import * as React from "react";
import {
  Popover,
  Button,
  Stack,
  Row,
  Icon,
  Text,
  Heading,
  Form,
  Link,
  LoadingSpinner,
} from "@open-decision/design-system";
import { ClipboardCopyIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import { useNotificationStore } from "../../../config/notifications";
import { useTreeAPI } from "../../Data/useTreeAPI";

type Props = { treeId: string };

export function PrototypButton({ treeId }: Props) {
  const { data: hasPreview } = useTreeAPI().useTreeQuery(treeId, {
    select: (data) => data.data.hasPreview,
  });
  const { mutate: updateTree, isLoading } = useTreeAPI().useUpdate({
    notification: false,
    onSuccess: (_, { body: { hasPreview } }) => {
      hasPreview
        ? addNotification({
            title: notificationMessages("enablePreview.title"),
            content: notificationMessages("enablePreview.content", { link }),
            duration: 5,
            variant: "success",
          })
        : addNotificationFromTemplate("disablePreview");
    },
  });
  const formState = Form.useFormState({
    defaultValues: { preview: hasPreview },
  });
  const t = useTranslations("builder.header.prototypeButton");
  const notificationMessages = useTranslations("common.notifications");
  const common = useTranslations("common");
  const { addNotification, addNotificationFromTemplate } =
    useNotificationStore();

  const link = `${process.env["NEXT_PUBLIC_OD_BUILDER_ENDPOINT"]}/builder/${treeId}/preview`;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button css={{ minWidth: "max-content" }}>{t("button")}</Button>
      </Popover.Trigger>
      <Popover.Content sideOffset={15} asChild>
        <Stack
          css={{
            zIndex: "$10",
            maxWidth: "350px",
            padding: "$5",
            gap: "$2",
          }}
        >
          <Heading as="h2">{t("popover.title")}</Heading>
          <Text css={{ marginBottom: "$2" }}>{t("popover.description")}</Text>
          <Stack css={{ gap: "$3", justifyContent: "space-between" }}>
            <Form.Root state={formState}>
              <Row css={{ gap: "$2" }}>
                <Form.Field
                  Label={t("popover.checkbox")}
                  layout="inline-right"
                  css={{ maxWidth: "max-content" }}
                >
                  <Form.Checkbox
                    name={formState.names.preview}
                    formState={formState}
                    onChange={(event) => {
                      updateTree({
                        body: { hasPreview: event.target.checked },
                        params: { uuid: treeId },
                      });
                    }}
                    disabled={isLoading}
                  />
                </Form.Field>
                {isLoading ? <LoadingSpinner /> : null}
              </Row>
            </Form.Root>
            {hasPreview ? (
              <Row css={{ justifyContent: "space-between" }}>
                <NextLink href={link} passHref>
                  <Link css={{ gap: "$1" }} target="_blank">
                    {t("popover.newTabLink")}
                    <Icon>
                      <ExternalLinkIcon />
                    </Icon>
                  </Link>
                </NextLink>
                <Button
                  onClick={() => {
                    addNotificationFromTemplate("copyLink");
                    navigator.clipboard.writeText(link);
                  }}
                >
                  <Icon>
                    <ClipboardCopyIcon />
                  </Icon>
                  {common("projectMenu.publish.copyLink")}
                </Button>
              </Row>
            ) : null}
          </Stack>
        </Stack>
      </Popover.Content>
    </Popover.Root>
  );
}
