import * as React from "react";
import { Link } from "../Link";
import { IconButton } from "../Button/IconButton";
import { styled } from "../stitches";
import { AtIcon } from "./icons/AtIcon";
import { GithubIcon } from "./icons/Github";
import { SlackIcon } from "./icons/Slack";

const Container = styled("div", { display: "flex", gap: "$4" });

const Buttons = [
  <IconButton
    //FIXME
    //@ts-expect-error - missing as capability
    as="a"
    href="https://slack.open-decision.org"
    target="_blank"
    label="Tritt unserem Slack Channel bei und vernetzte dich mit anderen Legal Tech Interessierten."
    variant="tertiary"
    Icon={
      <SlackIcon
        css={{ height: "30px", width: "30px" }}
        style={{ fill: "white" }}
      />
    }
  />,
  <IconButton
    //FIXME
    //@ts-expect-error - missing as capability
    as="a"
    href="https://github.com/open-decision"
    target="_blank"
    label="Schau Open Decisions Source Code auf GitHub an."
    variant="tertiary"
    Icon={
      <GithubIcon css={{ height: "30px", width: "30px", fill: "$gray12" }} />
    }
  />,
  <IconButton
    //FIXME
    //@ts-expect-error - missing as capability
    as="a"
    href="/#contact"
    label="Schreib uns direkt bei allen Fragen."
    variant="tertiary"
    Icon={<AtIcon css={{ height: "32px", width: "32px", stroke: "$gray12" }} />}
  />,
];

export type ContactButtonsContainerProps = React.ComponentProps<
  typeof Container
>;
export const ContactButtons = { Container, Buttons };
