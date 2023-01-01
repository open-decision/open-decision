import { useTreeAPI } from "@open-decision/api-react-binding";
import { DropdownMenu, Icon } from "@open-decision/design-system";
import { ArchiveIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

export type PublishItemProps = {
  treeId: string;
  status: "ARCHIVED" | "ACTIVE";
};

export function ArchiveItem({ treeId, status }: PublishItemProps) {
  const t = useTranslations("common.projectMenu");
  const { mutate: archive } = useTreeAPI().useArchive();
  const { mutate: unarchive } = useTreeAPI().useUnArchive();

  return (
    <DropdownMenu.Item
      onSelect={() =>
        status === "ARCHIVED"
          ? unarchive({ params: { uuid: treeId } })
          : archive({ params: { uuid: treeId } })
      }
    >
      <Icon className="mt-[2px]">
        <ArchiveIcon />
      </Icon>
      {status === "ARCHIVED" ? t("unarchive") : t("archive")}
    </DropdownMenu.Item>
  );
}
