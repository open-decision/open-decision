import { Box, css, Heading, Text } from "@open-legal-tech/design-system";
import { Element } from "slate";
import { RenderElementProps } from "slate-react";

const elementMarks = (element: Element) =>
  css({
    textAlign: element?.justify ?? "match-parent",
  })();

export const renderElement = (props: RenderElementProps): JSX.Element => {
  switch (props.element.type) {
    case "h1": {
      return (
        <Heading
          className={elementMarks(props.element)}
          size="lg"
          {...props.attributes}
        >
          {props.children}
        </Heading>
      );
    }
    case "h2":
      return (
        <Heading className={elementMarks(props.element)} size="md" {...props} />
      );
    case "h3":
      return (
        <Heading className={elementMarks(props.element)} size="xs" {...props} />
      );
    case "ul":
      return (
        <ul
          className={elementMarks(props.element)}
          style={{ listStyle: "revert", marginLeft: "5px" }}
          {...props.attributes}
        >
          {props.children}
        </ul>
      );
    case "ol":
      return (
        <ol
          className={elementMarks(props.element)}
          style={{ listStyle: "revert", marginLeft: "5px" }}
          {...props.attributes}
        >
          {props.children}
        </ol>
      );
    case "li":
      return (
        <li className={elementMarks(props.element)} {...props.attributes}>
          {props.children}
        </li>
      );
    case "a":
      return (
        <a
          className={elementMarks(props.element)}
          style={{ all: "revert" }}
          href={props.element.href}
          {...props.attributes}
        >
          {props.children}
        </a>
      );
    case "p":
      return (
        <Text className={elementMarks(props.element)} {...props.attributes}>
          {props.children}
        </Text>
      );
    default:
      return <Box className={elementMarks(props.element)} {...props} />;
  }
};
