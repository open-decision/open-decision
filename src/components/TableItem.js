import React from "react";
import { Tag } from "components";
import { readableColor } from "polished";

export const TableItem = ({ className, content }) => {
  return (
    <div
      sx={{
        display: "grid",
        fontSize: 3,
        gridTemplateColumns: "inherit",
        alignItems: "center",
      }}
      className={className}
    >
      <input type="checkbox" />
      <div>
        <a href={content.slug}>{content.name}</a>
        <span sx={{ fontSize: "0.7em" }}>{content.description}</span>
      </div>
      <div sx={{ display: "flex" }}>
        {content.tags !== null &&
          JSON.parse(content.tags).string.map((tag) => (
            <Tag
              sx={{
                fontSize: "0.7em",
                mx: 2,
                backgroundColor: tag.color,
                color: readableColor(tag.color),
              }}
              key={tag.name}
            >
              {tag.name}
            </Tag>
          ))}
      </div>
      <div>{content.createdAt.substring(0, 10)}</div>
    </div>
  );
};
