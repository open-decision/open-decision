import {
  Box,
  Heading as SystemHeading,
  Stack,
  styled,
  Text,
} from "@open-decision/design-system";

export const Container = styled(Stack, {
  gap: "$6",
  layer: "1",
  width: "clamp(400px, 50vw, 500px)",
  padding: "$9",
  boxShadow: "$7",
  borderRadius: "$md",
});

export const Header = styled("header", Stack, {
  gap: "$2",
});

export const Heading = SystemHeading;
Heading.defaultProps = { size: "large" };

export const Description = styled(Text, { color: "$gray11" });
Description.defaultProps = { size: "large" };

export const Body = styled("main", Box);

export const Footer = styled("footer", Box);
