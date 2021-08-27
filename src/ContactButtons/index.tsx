import * as React from "react";
import { IconButton } from "../IconButton";
import { styled } from "../stitches";
import { AtIcon } from "./icons/AtIcon";
import { GithubIcon } from "./icons/Github";
import { SlackIcon } from "./icons/Slack";

const Container = styled("div", { display: "flex", gap: "$4" });

const StyledIconButton = styled(IconButton, {});
StyledIconButton.defaultProps = { variant: "tertiary" };

const Buttons = [
  {
    link: "https://slack.open-decision.org",
    external: true,
    Component: (
      <StyledIconButton
        label="Tritt unserem Slack Channel bei und vernetzte dich mit anderen Legal Tech Interessierten."
        Icon={
          <SlackIcon
            css={{ height: "30px", width: "30px" }}
            style={{ fill: "white" }}
          />
        }
      />
    ),
  },
  {
    link: "https://github.com/open-decision",
    external: true,
    Component: (
      <StyledIconButton
        label="Schau Open Decisions Source Code auf GitHub an."
        Icon={
          <GithubIcon
            css={{ height: "30px", width: "30px", fill: "$gray12" }}
          />
        }
      />
    ),
  },
  {
    link: "/#contact",
    external: false,
    Component: (
      <StyledIconButton
        label="Schreib uns direkt bei allen Fragen."
        Icon={
          <AtIcon css={{ height: "32px", width: "32px", stroke: "$gray12" }} />
        }
      />
    ),
  },
];

export const ContactButtons = { Container, Buttons };
