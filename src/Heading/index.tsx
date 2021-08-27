import { styled } from "../stitches";
import { Text } from "../Text";

const responsiveFontSize = {
  variants: {
    size: {
      xl: {
        fontSize: "$4xl",
        "@smallTablet": { fontSize: "$6xl" },
        "@desktop": { fontSize: "$7xl" },
      },
      lg: {
        fontSize: "$3xl",

        "@smallTablet": { fontSize: "$5xl" },
      },
      md: {
        fontSize: "$2xl",

        "@smallTablet": { fontSize: "$3xl" },
      },
      sm: {
        fontWeight: "$medium",
        fontSize: "$2xl",

        "@smallTablet": { fontSize: "$3xl" },
      },
      xs: {
        fontWeight: "$medium",
        fontSize: "$xl",

        "@smallTablet": {
          fontSize: "$2xl",
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
  },
} as const;

const Container = styled("header", { ...responsiveFontSize });

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
export const Heading = styled("h2", {
  fontFamily: "$heading",
  color: "var(--color, $gray12)",
  margin: "unset",
  fontWeight: "$semibold",
  letterSpacing: "$-1",
  lineHeight: "$tight",
  ...responsiveFontSize,
});

/**
 * ### Paragraph based Headings
 *
 * Since only actual headings should have a heading html element this component gives you all kinds of variations
 * for additional supportive Heading elements like subtitles or subheadings. They are sized in relation to the containers font size.
 * {@link https://www.w3.org/TR/2016/REC-html51-20161101/common-idioms-without-dedicated-elements.html#subheadings-subtitles-alternative-titles-and-taglines HTML Spec}
 */
const SubHeading = styled(Text, {
  fontSize: "max(0.5em, 16px)",
  letterSpacing: "$1",

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
