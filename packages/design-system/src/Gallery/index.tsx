import * as React from "react";
import { Box } from "@open-decision/design-system/src/Box";
import { Button } from "@open-decision/design-system/src/Button/Button";
import { merge } from "remeda";
import { styled } from "@open-decision/design-system/src/stitches";
import { Icon } from "@open-decision/design-system/src/Icon/Icon";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

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

const ArrowButton = styled(Button, {
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
        variant="neutral"
        css={{ order: 1, "@smallTablet": { order: "revert" } }}
        onClick={() =>
          ref.current?.scrollBy({
            left: -(ref.current.clientWidth + gap),
            behavior: "smooth",
          })
        }
      >
        <Icon label="scroll back">
          <ChevronLeftIcon width={30} height={30} />
        </Icon>
      </ArrowButton>
      <Box
        css={{
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
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
        variant="neutral"
        css={{ order: 2, "@smallTablet": { order: "revert" } }}
        onClick={() =>
          ref.current?.scrollBy({
            left: ref.current.clientWidth + gap,
            behavior: "smooth",
          })
        }
      >
        <Icon label="scroll forwards">
          <ChevronRightIcon width={30} height={30} />
        </Icon>
      </ArrowButton>
    </StyledOuterBox>
  );
}

export type GalleryContainerProps = React.ComponentProps<typeof Container>;
export type GallerySetProps = React.ComponentProps<typeof Set>;
export const Gallery = { Container, Set };
