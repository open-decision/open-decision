import { Badge, Stack } from "@open-legal-tech/design-system";
import React from "react";

type Props = { tags: any };

export const TreeTags = ({ tags }: Props) => {
  return tags != null ? (
    <Stack css={{ flexDirection: "row", gap: "$2", marginTop: "$3" }}>
      {tags.map((tag) => (
        <Badge key={tag.name} color={tag.color} css={{ boxShadow: "$sm" }}>
          {tag.name}
        </Badge>
      ))}
    </Stack>
  ) : null;
};
