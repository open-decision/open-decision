/* eslint-disable react/jsx-key */
import * as React from "react";
import { Icon } from "../Icon/Icon";
import { styled } from "../stitches";
import { AtIcon } from "./icons/AtIcon";
import { GithubIcon } from "./icons/Github";
import { SlackIcon } from "./icons/Slack";
import { buttonStyles } from "../Button/Button";

const Container = styled("div", { display: "flex", gap: "$4" });

const Buttons = [
  <a
    href="https://slack.open-decision.org"
    target="_blank"
    rel="noreferrer"
    className={buttonStyles({ variant: "tertiary" })}
  >
    <Icon label="Tritt unserem Slack Channel bei und vernetzte dich mit anderen Legal Tech Interessierten.">
      <SlackIcon
        css={{ height: "30px", width: "30px" }}
        style={{ fill: "white" }}
      />
    </Icon>
  </a>,
  <a
    href="https://github.com/open-legal-tech/open-decision "
    target="_blank"
    rel="noreferrer"
    className={buttonStyles({ variant: "tertiary" })}
  >
    <Icon label="Schau Open Decisions Source Code auf GitHub an.">
      <GithubIcon css={{ height: "30px", width: "30px", fill: "$gray12" }} />
    </Icon>
  </a>,
  <a
    href="/#contact"
    target="_blank"
    rel="noreferrer"
    className={buttonStyles({ variant: "tertiary" })}
  >
    <Icon label="Schreib uns direkt bei allen Fragen.">
      <AtIcon css={{ height: "32px", width: "32px", stroke: "$gray12" }} />
    </Icon>
  </a>,
];

export type ContactButtonsContainerProps = React.ComponentProps<
  typeof Container
>;
export const ContactButtons = { Container, Buttons };
