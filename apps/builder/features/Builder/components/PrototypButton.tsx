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
  LoadingSpinner,
  linkClasses,
  addNotification,
} from "@open-decision/design-system";
import { ClipboardCopyIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import { useNotificationTemplate } from "@open-decision/design-system";
import { useTreeAPI } from "@open-decision/api-react-binding";

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
  const methods = Form.useForm({
    defaultValues: { preview: hasPreview },
  });
  const t = useTranslations("builder.header.prototypeButton");
  const notificationMessages = useTranslations("common.notifications");
  const common = useTranslations("common");
  const addNotificationFromTemplate = useNotificationTemplate();

  const link =
    `${process.env["NEXT_PUBLIC_OD_BUILDER_ENDPOINT"]}/builder/${treeId}/prototype`.replace(
      " ",
      ""
    );

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button className="min-w-max">{t("button")}</Button>
      </Popover.Trigger>
      <Popover.Content sideOffset={15} asChild>
        <Stack className="z-10 max-w-[350px] p-5 gap-2">
          <Heading as="h2">{t("popover.title")}</Heading>
          <Text className="mb-2">{t("popover.description")}</Text>
          <Stack className="gap-3 justify-between">
            <Form.Root methods={methods}>
              <Row className="gap-2">
                <Form.Field
                  Label={t("popover.checkbox")}
                  layout="inline-right"
                  className="max-w-max"
                >
                  <Form.Checkbox
                    {...methods.register("preview", {
                      onChange: (event) => {
                        updateTree({
                          body: { hasPreview: event.target.checked },
                          params: { uuid: treeId },
                        });
                      },
                    })}
                    disabled={isLoading}
                  />
                </Form.Field>
                {isLoading ? <LoadingSpinner /> : null}
              </Row>
            </Form.Root>
            {hasPreview ? (
              <Row className="justify-between">
                <NextLink
                  href={link}
                  className={linkClasses({}, "gap-1")}
                  target="_blank"
                >
                  {t("popover.newTabLink")}
                  <Icon>
                    <ExternalLinkIcon />
                  </Icon>
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
