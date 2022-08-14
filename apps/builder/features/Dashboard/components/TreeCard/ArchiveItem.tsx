import { DropdownMenu, Icon } from "@open-decision/design-system";
import { ArchiveIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useTreeAPI } from "../../../Data/useTreeAPI";

export type PublishItemProps = {
  treeId: string;
  status: "ARCHIVED" | "ACTIVE";
};

export function ArchiveItem({ treeId, status }: PublishItemProps) {
  const t = useTranslations("dashboard.treeList.cardMenu");
  const { mutate: archive } = useTreeAPI().useArchive();
  const { mutate: unarchive } = useTreeAPI().useUnArchive();

  return (
    <DropdownMenu.Item
      onSelect={() =>
        status === "ARCHIVED"
          ? unarchive({ uuid: treeId })
          : archive({ uuid: treeId })
      }
    >
      <Icon css={{ marginTop: "2px" }}>
        <ArchiveIcon />
      </Icon>
      {status === "ARCHIVED" ? t("unarchive") : t("archive")}
    </DropdownMenu.Item>
  );
}
