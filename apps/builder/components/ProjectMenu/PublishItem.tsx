import { DropdownMenu, Icon, Tooltip } from "@open-decision/design-system";
import {
  UploadIcon,
  OpenInNewWindowIcon,
  ClipboardCopyIcon,
} from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useNotificationTemplate } from "@open-decision/design-system";
import { useTreeAPI } from "@open-decision/api-react-binding";

export type PublishItemProps = {
  treeId: string;
  treeName: string;
  publishedTreeId?: string;
};

export function PublishItem({
  treeId,
  treeName,
  publishedTreeId,
}: PublishItemProps) {
  const t = useTranslations("common.projectMenu.publish");
  const { mutate: publish } = useTreeAPI().usePublish();
  const { mutate: unPublish } = useTreeAPI().useUnPublish();
  const addNotificationFromTemplate = useNotificationTemplate();

  const link =
    `${process.env["NEXT_PUBLIC_OD_BUILDER_ENDPOINT"]}/public/${publishedTreeId}`.replace(
      " ",
      ""
    );

  return (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTriggerItem>
        <Icon className="mt-[2px]">
          <UploadIcon />
        </Icon>
        {t("publish")}
      </DropdownMenu.SubTriggerItem>
      <DropdownMenu.SubContent sideOffset={10}>
        <DropdownMenu.Item
          onSelect={() =>
            publishedTreeId
              ? unPublish({ params: { uuid: publishedTreeId } })
              : publish({
                  params: { treeUuid: treeId },
                  body: { name: treeName },
                })
          }
        >
          <Icon className="mt-[2px]">
            <UploadIcon />
          </Icon>
          {publishedTreeId ? t("unpublish") : t("publish")}
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        {publishedTreeId ? (
          <>
            <DropdownMenu.Item asChild>
              <a href={link} target="_blank" rel="noreferrer">
                <Icon className="mt-[2px]">
                  <OpenInNewWindowIcon />
                </Icon>
                {t("open")}
              </a>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={() => {
                navigator.clipboard.writeText(link);
                addNotificationFromTemplate("copyLink");
              }}
            >
              <Icon className="mt-[2px]">
                <ClipboardCopyIcon />
              </Icon>
              {t("copyLink")}
            </DropdownMenu.Item>
          </>
        ) : (
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <div>
                <DropdownMenu.Item disabled>
                  <Icon className="mt-[2px]">
                    <OpenInNewWindowIcon />
                  </Icon>
                  {t("open")}
                </DropdownMenu.Item>
                <DropdownMenu.Item disabled>
                  <Icon className="mt-[2px]">
                    <ClipboardCopyIcon />
                  </Icon>
                  {t("copyLink")}
                </DropdownMenu.Item>
              </div>
            </Tooltip.Trigger>
            <Tooltip.Content side="bottom">
              Veröffentliche den Baum zuerst.
            </Tooltip.Content>
          </Tooltip.Root>
        )}
      </DropdownMenu.SubContent>
    </DropdownMenu.Sub>
  );
}
