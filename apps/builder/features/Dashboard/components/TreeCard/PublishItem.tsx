import { DropdownMenu, Icon } from "@open-decision/design-system";
import { Share2Icon } from "@radix-ui/react-icons";
import { queryClient } from "../../../../features/Data/queryClient";
import {
  usePublishTreeMutation,
  useTreesQuery,
  useUnPublishTreeMutation,
} from "../../../../features/Data/generated/graphql";

export type PublishItemProps = { treeId: string; published: boolean };

export function PublishItem({ treeId, published }: PublishItemProps) {
  const { mutate: publish } = usePublishTreeMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(useTreesQuery.getKey());
    },
  });

  const { mutate: unPublish } = useUnPublishTreeMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(useTreesQuery.getKey());
    },
  });

  return (
    <DropdownMenu.Item
      onSelect={() =>
        published ? unPublish({ uuid: treeId }) : publish({ uuid: treeId })
      }
    >
      <Icon css={{ marginTop: "2px" }}>
        <Share2Icon />
      </Icon>
      {published ? "Unveröffentlichen" : "Veröffentlichen"}
    </DropdownMenu.Item>
  );
}
