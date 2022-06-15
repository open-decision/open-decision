import { DropdownMenu, Icon } from "@open-decision/design-system";
import { ArchiveIcon } from "@radix-ui/react-icons";
import { queryClient } from "../../../../features/Data/queryClient";
import { useMutation } from "react-query";
import { useOD } from "../../../../../builder/features/Data/odClient";
import { useTreesQueryKey } from "../../../Data/useTreesQuery";

export type PublishItemProps = {
  treeId: string;
  status: "ARCHIVED" | "ACTIVE";
};

export function ArchiveItem({ treeId, status }: PublishItemProps) {
  const OD = useOD();

  const { mutate: archive } = useMutation(
    () =>
      OD.trees.update({
        body: { status: "ARCHIVED" },
        params: { uuid: treeId },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(useTreesQueryKey);
      },
    }
  );

  const { mutate: unarchive } = useMutation(
    () =>
      OD.trees.update({
        body: { status: "ACTIVE" },
        params: { uuid: treeId },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(useTreesQueryKey);
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
