import React from "react";
import { Badge } from "theme-ui";
import { readableColor } from "polished";

export const Tags = ({ className, values }) => {
  return (
    <>
      {values.map((tag, idx) => {
        return (
          <Badge
            variant="primary"
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
        );
      })}
    </>
  );
};
