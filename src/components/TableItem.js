import React from "react";
import { Tag } from "components";

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
        {content.tags.map((tag) => (
          <Tag sx={{ fontSize: "0.7em", mx: 2 }} key={tag}>
            {tag.name}
          </Tag>
        ))}
      </div>
      <div>
        {content.createdAt.substring(0, content.createdAt.indexOf("T"))}
      </div>
    </div>
  );
};
