import { Box, css, Heading, Text } from "@open-legal-tech/design-system";
import { RenderElementProps } from "slate-react";
import { Link } from "./elements/Link";

const listStyles = css({
  listStyle: "revert",
  textStyle: "small-text",
  paddingInlineStart: "$6",
});

export const renderElement = (props: RenderElementProps): JSX.Element => {
  switch (props.element.type) {
    case "heading": {
      return (
        <Heading size="extra-small" {...props.attributes}>
          {props.children}
        </Heading>
      );
    }
    case "unordered_list":
      return (
        <ul className={listStyles()} {...props.attributes}>
          {props.children}
        </ul>
      );
    case "ordered_list":
      return (
        <ol className={listStyles()} {...props.attributes}>
          {props.children}
        </ol>
      );
    case "list_item":
      return <li {...props.attributes}>{props.children}</li>;
    case "link":
      return <Link {...props} />;
    case "paragraph":
      return (
        <Text size="small" {...props.attributes}>
          {props.children}
        </Text>
      );
    default:
      return <Box {...props} />;
  }
};
