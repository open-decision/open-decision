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
  addNotification,
  Separator,
  buttonClasses,
} from "@open-decision/design-system";
import {
  ClipboardCopyIcon,
  ExternalLinkIcon,
  PlayIcon,
} from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import { useNotificationTemplate } from "@open-decision/design-system";
import { useTreeAPI } from "@open-decision/api-react-binding";

type Props = { treeId: string; hasPreview: boolean };

export function PrototypButton({ treeId, hasPreview }: Props) {
  const notificationMessages = useTranslations("common.notifications");

  const { mutate: updateTree, isLoading: isUpdating } = useTreeAPI().useUpdate({
    notification: false,
    onSuccess: (_, { body: { hasPreview } }) => {
      hasPreview
        ? addNotification({
            title: notificationMessages("enablePreview.title"),
            content: notificationMessages("enablePreview.content", {
              link: sharingLink,
            }),
            duration: 5,
            variant: "success",
          })
        : addNotificationFromTemplate("disablePreview");
    },
  });

  const methods = Form.useForm({
    defaultValues: { preview: hasPreview },
  });

  const tPreview = useTranslations("builder.header.preview");
  const addNotificationFromTemplate = useNotificationTemplate();

  const link =
    `${process.env["NEXT_PUBLIC_OD_BUILDER_ENDPOINT"]}/builder/${treeId}/prototype`.replace(
      " ",
      ""
    );

  const sharingLink =
    `${process.env["NEXT_PUBLIC_OD_BUILDER_ENDPOINT"]}/shared/prototype/${treeId}`.replace(
      " ",
      ""
    );

  return (
    <Popover.Root>
      <Row>
        <Popover.Trigger asChild>
          <Button className="min-w-max rounded-none rounded-l-md">
            {tPreview("button")}
          </Button>
        </Popover.Trigger>
        <Separator orientation="vertical" />
        <NextLink
          href={link}
          className={buttonClasses({}, "rounded-none rounded-r-md")}
          target="_blank"
          aria-label={tPreview("previewLink.hiddenLabel")}
        >
          <Icon>
            <PlayIcon />
          </Icon>
        </NextLink>
      </Row>
      <Popover.Content sideOffset={15} asChild>
        <Stack className="z-10 max-w-[350px] p-5 gap-2">
          <Heading as="h2">{tPreview("popover.title")}</Heading>
          <Text className="mb-2">{tPreview("popover.description")}</Text>
          <Stack className="gap-3 justify-between">
            <Form.Root methods={methods}>
              <Row className="gap-2">
                <Form.Field
                  Label={tPreview("popover.checkbox")}
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
                    disabled={isUpdating}
                  />
                </Form.Field>
                {isUpdating ? <LoadingSpinner /> : null}
              </Row>
            </Form.Root>
            <Row className="gap-2">
              <Button
                disabled={!hasPreview}
                variant="secondary"
                size="small"
                className="flex-1"
                onClick={() => {
                  addNotificationFromTemplate("copyLink");
                  navigator.clipboard.writeText(sharingLink);
                }}
              >
                <Icon>
                  <ClipboardCopyIcon />
                </Icon>
                {!hasPreview
                  ? tPreview("popover.copyLinkButton.disabled")
                  : tPreview("popover.copyLinkButton.enabled")}
              </Button>
              {hasPreview ? (
                <NextLink
                  className={buttonClasses({
                    variant: "tertiary",
                    size: "small",
                  })}
                  href={sharingLink}
                  target="_blank"
                  aria-label={tPreview("popover.openSharedPreviewButton")}
                >
                  <Icon>
                    <ExternalLinkIcon />
                  </Icon>
                </NextLink>
              ) : null}
            </Row>
          </Stack>
        </Stack>
      </Popover.Content>
    </Popover.Root>
  );
}
