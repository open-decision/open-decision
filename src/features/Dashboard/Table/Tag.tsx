import React from "react";
import { readableColor } from "polished";
import { Component } from "@internalTypes/global";
import { Badge } from "@components/index";

type TagProps = {
  values: { color: string; name: string }[];
};

export const Tags: Component<TagProps> = ({ className = "", values = [] }) => {
  return (
    <div>
      {values.map((tag, idx) => (
        <Badge
          key={idx}
          sx={{
            bg: tag.color,
            color: readableColor(tag.color),
            m: 1,
          }}
          className={className}
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  );
};
