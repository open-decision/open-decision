import React from "react";
import { Tag } from "components";

const content = {
  name: "Demobaum",
  description: "Lorem Ipsum ...",
  tags: ["label1", "label2", "label3"],
  lastEdit: "25.05.1995",
  editable: true,
};

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
        <div>{content.name}</div>
        <span sx={{ fontSize: "0.7em" }}>{content.description}</span>
      </div>
      <div sx={{ display: "flex" }}>
        {content.tags.map((tag) => (
          <Tag sx={{ fontSize: "0.7em", mx: 2 }} key={tag}>
            {tag}
          </Tag>
        ))}
      </div>
      <div>{content.lastEdit}</div>
    </div>
  );
};

TableItem.defaultProps = { content: content };
