/**@jsx jsx */
import { jsx } from "theme-ui";
import { Badge, Box } from "theme-ui";
import { readableColor } from "polished";
import { FunctionComponent } from "react";
import { GlobalProps } from "@internalTypes/global";

type TagProps = {
  values: { color: string; name: string }[];
} & GlobalProps;

export const Tags: FunctionComponent<TagProps> = ({
  className = "",
  values = [],
}) => {
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
