import { DropdownMenu, Icon } from "@open-decision/design-system";
import { Share2Icon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { proxiedOD } from "../../../../../builder/features/Data/odClient";
import { treesQueryKey } from "../../../Data/useTreesQuery";

export type PublishItemProps = { treeId: string; publishedTreeId?: string };

export function PublishItem({ treeId, publishedTreeId }: PublishItemProps) {
  const queryClient = useQueryClient();
  const { mutate: publish } = useMutation(
    ["publishTree"],
    () =>
      proxiedOD.trees.publishedTrees.create({
        params: { treeUuid: treeId },
        body: { name: "test" },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(treesQueryKey);
      },
    }
  );

  const { mutate: unPublish } = useMutation(
    ["unpublishTree"],
    (publishedTreeId: string) => {
      return proxiedOD.publishedTrees.delete({
        params: { uuid: publishedTreeId },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(treesQueryKey);
      },
    }
  );

  return (
    <DropdownMenu.Item
      onSelect={() =>
        publishedTreeId ? unPublish(publishedTreeId) : publish()
      }
    >
      <Icon css={{ marginTop: "2px" }}>
        <Share2Icon />
      </Icon>
      {publishedTreeId ? "Unveröffentlichen" : "Veröffentlichen"}
    </DropdownMenu.Item>
  );
}
