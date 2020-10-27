/**@jsx jsx */
import { FunctionComponent } from "react";
import { jsx, Heading } from "theme-ui";
import { InternalLink } from "./InternalLink";

type LogoProps = {
  accentColor: "primary" | "secondary" | "tertiary";
};

export const Logo: FunctionComponent<LogoProps> = ({ accentColor }) => {
  return (
    <InternalLink variant="nav" to="/">
      <Heading as="h1" sx={{ color: "grays.4", fontSize: 5, flex: "1 1 60" }}>
        open <span sx={{ color: `${accentColor}.0` }}>decision</span>
      </Heading>
    </InternalLink>
  );
};
