import React from "react";
import Link from "next/link";
import { StyleObject, Heading, styled } from "@open-legal-tech/design-system";
import Image from "next/image";
import LogoImg from "../../public/assets/OD_LOGO.svg";

const Title = styled(Heading, {
  width: "200px",
});

type LogoProps = {
  css?: StyleObject;
};

export const Logo = ({ css }: LogoProps): JSX.Element => (
  <Link href="/">
    <Title as="h1" css={css}>
      <Image
        src={LogoImg}
        layout="responsive"
        alt="open-decision Logo click to go to Dashboard"
      />
    </Title>
  </Link>
);
