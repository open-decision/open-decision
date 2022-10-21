import { Box } from "@open-decision/design-system/src/Box";
import { styled } from "@open-decision/design-system/src/stitches";

const Front = styled("div", {
  backfaceVisibility: "hidden",
  willChange: "transform",
  width: "100%",
  height: "100%",
  position: "relative",

  "@animation": {
    transition: "transform 800ms 150ms",
  },
});

const Back = styled("div", {
  backfaceVisibility: "hidden",
  willChange: "transform",
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "white",
  color: "black",
  transform: "rotateY(-180deg)",

  "@animation": {
    transition: "transform 800ms 150ms",
  },
});

const Container = styled(Box, {
  position: "relative",
  cursor: "pointer",

  [`&:hover > ${Front}, &:focus > ${Front}`]: {
    transform: "rotateY(180deg)",

    "@animation": {
      transition: "transform 400ms",
    },
  },

  [`&:hover > ${Back}, &:focus > ${Back}`]: {
    transform: "rotateY(0deg)",

    "@animation": {
      transition: "transform 400ms",
    },
  },
});

export const FlippableCard = { Container, Front, Back };
