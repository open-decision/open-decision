import { IconButton, Badge } from "@open-legal-tech/design-system";
import React from "react";
import { ValidTreeNode } from "./types";
import { PlusCircledIcon } from "@radix-ui/react-icons";

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
        <PlusCircledIcon className="w-6 h-6" />
      </IconButton>
    </div>
  );
};
