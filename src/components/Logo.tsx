import React from "react";
import Link from "next/link";
import { StyleObject, styled } from "@open-legal-tech/design-system";

const Title = styled("h1", {
  width: "200px",
});

type LogoProps = {
  css?: StyleObject;
};

export const Logo = ({ css }: LogoProps): JSX.Element => (
  <Link href="/">
    <Title css={css}>
      <img src="/assets/OD_LOGO.svg" alt="open-decision logo" />
    </Title>
  </Link>
);
