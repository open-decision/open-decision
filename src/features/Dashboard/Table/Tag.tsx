/**@jsx jsx */
import { jsx } from "theme-ui";
import { Badge, Box } from "theme-ui";
import { readableColor } from "polished";
import { Component } from "@internalTypes/global";

type TagProps = {
  values: { color: string; name: string }[];
};

export const Tags: Component<TagProps> = ({ className = "", values = [] }) => {
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
