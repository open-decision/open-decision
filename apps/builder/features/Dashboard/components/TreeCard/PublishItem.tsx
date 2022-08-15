import { DropdownMenu, Icon } from "@open-decision/design-system";
import { Share2Icon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useTreeAPI } from "../../../Data/useTreeAPI";

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
  const t = useTranslations("dashboard.treeList");
  const { mutate: publish } = useTreeAPI().usePublish();
  const { mutate: unPublish } = useTreeAPI().useUnPublish();

  return (
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
      <Icon css={{ marginTop: "2px" }}>
        <Share2Icon />
      </Icon>
      {publishedTreeId ? t("cardMenu.unpublish") : t("cardMenu.publish")}
    </DropdownMenu.Item>
  );
}
