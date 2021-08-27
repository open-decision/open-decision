import * as React from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { Box } from "../Box";
import { IconButton } from "../IconButton";
import { merge } from "remeda";
import { styled } from "../stitches";

const StyledOuterBox = styled(Box, {
  $$arrowWidth: "50px",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  alignItems: "center",
  gap: "$4",

  "@smallTablet": {
    gridTemplateColumns: "$$arrowWidth $$contentWidth $$arrowWidth",
  },
});

const Set = styled(Box, {
  flex: "1 0 100%",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "$4",
  paddingBlock: "$4",
});

const ArrowButton = styled(IconButton, {
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "$2",
  userSelect: "none",
});

const gap = 50;

type Props = React.ComponentProps<typeof Box> & { contentAlign?: boolean };

function Container({ children, css, contentAlign = true, ...props }: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  return (
    <StyledOuterBox
      css={merge(
        {
          "@smallTablet": {
            transform: contentAlign
              ? "translate(calc(-$$arrowWidth - $space$4))"
              : null,
            $$contentWidth: contentAlign ? "100%" : "1fr",
          },
        },
        css ?? {}
      )}
      {...props}
    >
      <ArrowButton
        Icon={<ChevronLeftIcon width={30} height={30} />}
        label="scroll back"
        variant="ghost"
        css={{ order: 1, "@smallTablet": { order: "revert" } }}
        onClick={() =>
          ref.current?.scrollBy({
            left: -(ref.current.clientWidth + gap),
            behavior: "smooth",
          })
        }
      />
      <Box
        css={{
          display: "flex",
          overflow: "auto",
          gap: 50,
          gridColumn: "1 / -1",
          height: "100%",

          "@smallTablet": {
            gridColumn: 2,
          },
        }}
        ref={ref}
      >
        {children}
      </Box>
      <ArrowButton
        Icon={<ChevronRightIcon width={30} height={30} />}
        label="scroll forwards"
        variant="ghost"
        css={{ order: 2, "@smallTablet": { order: "revert" } }}
        onClick={() =>
          ref.current?.scrollBy({
            left: ref.current.clientWidth + gap,
            behavior: "smooth",
          })
        }
      />
    </StyledOuterBox>
  );
}

export const Gallery = { Container, Set };
