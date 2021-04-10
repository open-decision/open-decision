import React from "react";
import Link from "next/link";
import { CSS, styled } from "utils/stitches.config";

const Title = styled("h1", {
  width: "200px",
});

type LogoProps = {
  css?: CSS;
};

export const Logo = ({ css }: LogoProps): JSX.Element => (
  <Link href="/">
    <Title css={css}>
      <img src="/assets/OD_LOGO.svg" alt="open-decision logo" />
    </Title>
  </Link>
);
