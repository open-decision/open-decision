import { DropdownMenu, Icon } from "@open-decision/design-system";
import { ArchiveIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { proxiedOD } from "../../../../../builder/features/Data/odClient";
import { treesQueryKey } from "../../../Data/useTreesQuery";

export type PublishItemProps = {
  treeId: string;
  status: "ARCHIVED" | "ACTIVE";
};

export function ArchiveItem({ treeId, status }: PublishItemProps) {
  const queryClient = useQueryClient();
  const { mutate: archive } = useMutation(
    ["archiveTree"],
    () =>
      proxiedOD.trees.update({
        body: { status: "ARCHIVED" },
        params: { uuid: treeId },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(treesQueryKey);
      },
    }
  );

  const { mutate: unarchive } = useMutation(
    ["unarchiveTree"],
    () =>
      proxiedOD.trees.update({
        body: { status: "ACTIVE" },
        params: { uuid: treeId },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(treesQueryKey);
      },
    }
  );

  return (
    <DropdownMenu.Item
      onSelect={() => (status === "ARCHIVED" ? unarchive() : archive())}
    >
      <Icon css={{ marginTop: "2px" }}>
        <ArchiveIcon />
      </Icon>
      {status === "ARCHIVED" ? "Unarchivieren" : "Archivieren"}
    </DropdownMenu.Item>
  );
}
