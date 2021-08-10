import { PlusCircleOutline } from "@graywolfai/react-heroicons";
import { IconButton } from "@open-legal-tech/design-system";
import { Badge } from "components";
import React from "react";
import { ValidTreeNode } from "./types";

type TreeTagsProps = { tree: ValidTreeNode };

export const TreeTags: React.FC<TreeTagsProps> = ({ tree }) => {
  return (
    <div className="space-x-4 flex items-center">
      {tree.tags.map((tag) => (
        <Badge key={tag.name} color={tag.color} css={{ boxShadow: "$sm" }}>
          {tag.name}
        </Badge>
      ))}
      <IconButton
        alignContent
        variant="ghost"
        rounded="full"
        size="sm"
        label="Tag hinzufügen"
      >
        <PlusCircleOutline className="w-6 h-6" />
      </IconButton>
    </div>
  );
};
