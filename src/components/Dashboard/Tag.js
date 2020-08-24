import React from "react";
import { Badge, Box } from "theme-ui";
import { readableColor } from "polished";

export const Tags = ({ className = "", values }) => {
  return (
    <Box>
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
    </Box>
  );
};
