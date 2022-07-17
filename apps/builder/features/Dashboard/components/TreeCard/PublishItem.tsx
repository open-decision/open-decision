import { DropdownMenu, Icon } from "@open-decision/design-system";
import { Share2Icon } from "@radix-ui/react-icons";
import { queryClient } from "../../../../features/Data/queryClient";
import { useMutation } from "react-query";
import { proxiedOD } from "../../../../../builder/features/Data/odClient";
import { useTreesQueryKey } from "../../../Data/useTreesQuery";

export type PublishItemProps = { treeId: string; publishedTreeId?: string };

export function PublishItem({ treeId, publishedTreeId }: PublishItemProps) {
  const { mutate: publish } = useMutation(
    () =>
      proxiedOD.trees.publishedTrees.create({
        params: { treeUuid: treeId },
        body: { name: "test" },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(useTreesQueryKey);
      },
    }
  );

  const { mutate: unPublish } = useMutation(
    (publishedTreeId: string) => {
      return proxiedOD.publishedTrees.delete({
        params: { uuid: publishedTreeId },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(useTreesQueryKey);
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
