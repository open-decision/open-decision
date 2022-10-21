import { styled, css } from "../stitches";
import { Text } from "../Text";

const responsiveFontSize = {
  variants: {
    size: {
      "extra-large": {
        textStyle: "extra-large-heading",
      },
      large: {
        textStyle: "large-heading",
      },
      medium: {
        textStyle: "medium-heading",
      },
      small: {
        textStyle: "small-heading",
      },
      "extra-small": {
        textStyle: "extra-small-heading",
      },
    },
  },

  defaultVariants: {
    size: "medium",
  },
} as const;

const Container = styled("header", responsiveFontSize);

export const headingStyles = css(
  {
    fontFamily: "$heading",
    colorFallback: "$colorScheme-text",
    margin: "unset",
  },
  responsiveFontSize
);

export type HeadingProps = React.ComponentProps<typeof Heading>;
/**
 * ### A component for visual heading levels.
 *
 * - Headings are not supposed to be used for anything but the actual heading. Variations of subtitles or taglines are part of another
 * component see: {@link SubHeadings}
 *
 * - Use the `as` prop to change the semantic element.
 * @example
 * <Heading as="h4">My Heading</Heading>
 */
export const Heading = styled("h2", headingStyles);

/**
 * ### Paragraph based Headings
 *
 * Since only actual headings should have a heading html element this component gives you all kinds of variations
 * for additional supportive Heading elements like subtitles or subheadings. They are sized in relation to the containers font size.
 * {@link https://www.w3.org/TR/2016/REC-html51-20161101/common-idioms-without-dedicated-elements.html#subheadings-subtitles-alternative-titles-and-taglines HTML Spec}
 */
const SubHeading = styled(Text, {
  fontSize: "max(0.5em, 16px)",

  variants: {
    variant: {
      subtitle: {},
      tagline: {
        fontWeight: "$bold",
      },
    },
  },
});

export const HeadingGroup = { Container, Heading, SubHeading };
