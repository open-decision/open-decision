import React from "react";
import Link from "next/link";
import { Heading, styled } from "@open-decision/design-system";

const Title = styled(Heading, {
  width: "50px",
  aspectRatio: "1 / 1",

  variants: {
    variant: {
      dark: {
        ".outline": {
          fill: "$gray1",
        },

        ".inner-arrow": {
          fill: "$gray1",
        },
      },
      light: {
        ".background": {
          fill: "#312e81",
        },

        ".inner-arrow": {
          fill: "#22d3ee",
        },
      },
    },
  },
});
type LogoProps = React.ComponentProps<typeof Title>;

export const Logo = ({
  css,
  variant = "light",
  ...props
}: LogoProps): JSX.Element => (
  <Link href="/">
    <Title
      as="h1"
      css={{ display: "flex", alignItems: "center", ...css }}
      variant={variant}
      {...props}
    >
      {variant === "light" ? <LightLogo /> : <DarkLogo />}
    </Title>
  </Link>
);

const LightLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 202.21 202.21">
    <rect className="background" width="202.21" height="202.21" rx="35.48" />
    <path
      className="inner-arrow"
      d="M237.37,137.38l-48.62-28.07a11.83,11.83,0,0,0-14.25,1.86,12.29,12.29,0,0,0-3.48,8.76v4.6a2,2,0,0,1-3.64,1.13,39.91,39.91,0,1,0,0,44.26A2,2,0,0,1,171,171v4.69a12.19,12.19,0,0,0,2.85,8,11.87,11.87,0,0,0,14.88,2.54L237.65,158a11.84,11.84,0,0,0,5.25-14.14A12.24,12.24,0,0,0,237.37,137.38Zm-49.64,25.17v-6.4a2.88,2.88,0,0,0-2.88-2.89h-26a2.93,2.93,0,0,0-2.75,2,23.2,23.2,0,1,1,0-15,2.92,2.92,0,0,0,2.75,2h26a2.88,2.88,0,0,0,2.88-2.88V133a2.88,2.88,0,0,1,4.32-2.49l25.59,14.77a2.88,2.88,0,0,1,0,5L192.05,165A2.88,2.88,0,0,1,187.73,162.55Z"
      transform="translate(-66.79 -46.67)"
    />
  </svg>
);

const DarkLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 202.21 202.21">
    <path
      className="outline"
      d="M869.81,338.3a24.5,24.5,0,0,1,24.47,24.47V494a24.5,24.5,0,0,1-24.47,24.48H738.55A24.51,24.51,0,0,1,714.07,494V362.77a24.5,24.5,0,0,1,24.48-24.47H869.81m0-11H738.55a35.48,35.48,0,0,0-35.48,35.47V494a35.49,35.49,0,0,0,35.48,35.48H869.81A35.48,35.48,0,0,0,905.28,494V362.77a35.47,35.47,0,0,0-35.47-35.47Z"
      transform="translate(-703.07 -327.3)"
    />
    <path
      className="inner-arrow"
      d="M873.65,418,825,389.93a11.85,11.85,0,0,0-14.25,1.86,12.34,12.34,0,0,0-3.49,8.77v4.59a2,2,0,0,1-3.64,1.14,39.91,39.91,0,1,0,0,44.25,2,2,0,0,1,3.66,1.1v4.68a12.24,12.24,0,0,0,2.86,8A11.84,11.84,0,0,0,825,466.87l48.89-28.23a11.84,11.84,0,0,0,5.25-14.15A12.27,12.27,0,0,0,873.65,418ZM824,443.17v-6.4a2.88,2.88,0,0,0-2.88-2.88h-26a2.9,2.9,0,0,0-2.74,2,23.19,23.19,0,1,1,0-15,2.91,2.91,0,0,0,2.74,2h26A2.88,2.88,0,0,0,824,420v-6.4a2.88,2.88,0,0,1,4.33-2.49l25.58,14.77a2.88,2.88,0,0,1,0,5l-25.58,14.77A2.89,2.89,0,0,1,824,443.17Z"
      transform="translate(-703.07 -327.3)"
    />
  </svg>
);
