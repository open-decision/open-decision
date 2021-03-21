import { PlusCircleOutline } from "@graywolfai/react-heroicons";
import { Badge, Button } from "components";
import React from "react";
import { ValidTreeNode } from "./types";

type TreeTagsProps = { tree: ValidTreeNode };

export const TreeTags: React.FC<TreeTagsProps> = ({ tree }) => {
  return (
    <div className="space-x-4 px-4 py-2 flex items-center">
      {tree.tags.map((tag) => (
        <Badge key={tag.name} color={tag.color} className="shadow-sm">
          {tag.name}
        </Badge>
      ))}
      <Button rounded="full" size="small" variant="icon">
        <PlusCircleOutline className="w-6 h-6" />
      </Button>
    </div>
  );
};
