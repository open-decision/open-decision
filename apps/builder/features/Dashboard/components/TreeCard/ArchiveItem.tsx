import { DropdownMenu, Icon } from "@open-decision/design-system";
import { ArchiveIcon } from "@radix-ui/react-icons";
import { queryClient } from "../../../../features/Data/queryClient";
import {
  useArchiveTreeMutation,
  useTreesQuery,
  useUnArchiveTreeMutation,
} from "../../../../features/Data/generated/graphql";

export type PublishItemProps = {
  treeId: string;
  status: "ARCHIVED" | "ACTIVE";
};

export function ArchiveItem({ treeId, status }: PublishItemProps) {
  const { mutate: archive } = useArchiveTreeMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(useTreesQuery.getKey());
    },
  });

  const { mutate: unarchive } = useUnArchiveTreeMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(useTreesQuery.getKey());
    },
  });

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
      {status === "ARCHIVED" ? "Unarchivieren" : "Archivieren"}
    </DropdownMenu.Item>
  );
}
