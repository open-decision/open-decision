import { Box, Heading, Link, Text } from "@open-legal-tech/design-system";
import { listItemStyles, listStyles } from "components/RichTextEditor/Elements";
import { RenderElementProps } from "slate-react";

export const renderElement = (props: RenderElementProps): JSX.Element => {
  switch (props.element.type) {
    case "heading": {
      return <Heading {...props.attributes}>{props.children}</Heading>;
    }
    case "unordered_list":
      return (
        <ul
          className={listStyles({ css: { textStyle: "large-text" } })}
          {...props.attributes}
        >
          {props.children}
        </ul>
      );
    case "ordered_list":
      return (
        <ol
          className={listStyles({ css: { textStyle: "large-text" } })}
          {...props.attributes}
        >
          {props.children}
        </ol>
      );
    case "list_item":
      return (
        <li
          className={listItemStyles({ css: { textStyle: "large-text" } })}
          {...props.attributes}
        >
          {props.children}
        </li>
      );
    case "link":
      return <Link {...props} />;
    case "paragraph":
      return (
        <Text size="large" {...props.attributes}>
          {props.children}
        </Text>
      );
    default:
      return <Box {...props} />;
  }
};
