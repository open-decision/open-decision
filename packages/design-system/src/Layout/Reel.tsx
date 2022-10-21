import * as React from "react";
import useResizeObserver from "use-resize-observer";
import { mergeRefs } from "@open-decision/design-system/src/internal/utils";
import { styled } from "@open-decision/design-system/src/stitches";
import { gap, padding } from "@open-decision/design-system/src/shared/variants";

const Container = styled("div", padding, gap, {
  $$itemWidth: "auto",
  $$distanceToScrollbar: "$$padding",
  display: "flex",
  overflowX: "auto",
  overflowY: "hidden",
  scrollbarWidth: "none",

  "& > *": {
    flex: "0 0 $$itemWidth",
  },

  "& > img": {
    height: "100%",
    width: "auto",
    flexBasis: "auto",
  },

  "&::-webkit-scrollbar": {
    height: "1rem",
  },

  "&[data-overflowing='true']": {
    paddingBottom: "$$distanceToScrollbar",
  },

  variants: {
    hasScrollbar: {
      true: {
        scrollbarWidth: "auto",
      },
    },
    gapStart: {
      true: {
        "&::before": {
          content: "''",
          flexShrink: "0",
        },
      },
    },
    gapEnd: {
      true: {
        "&::after": {
          content: "''",
          flexShrink: "0",
        },
      },
    },
  },
  defaultVariants: {
    hasScrollbar: "true",
  },
});

export type ReelProps = React.ComponentProps<typeof Container> & {
  gapStart?: boolean;
  gapEnd?: boolean;
};

export const Reel = ({
  children,
  gapStart = false,
  gapEnd = true,
  ...props
}: ReelProps) => {
  const [overflowing, setOverflowing] = React.useState(false);

  const { ref } = useResizeObserver();

  const mergedRef = mergeRefs([
    ref,
    (element: HTMLDivElement | null) => {
      if (element != null) {
        const scrollWidth = element.scrollWidth;
        const elementWidth = element.clientWidth;
        setOverflowing(scrollWidth > elementWidth);
      }
    },
  ]);

  return (
    <Container
      gapStart={gapStart}
      gapEnd={gapEnd}
      ref={mergedRef}
      data-overflowing={overflowing}
      {...props}
    >
      {children}
    </Container>
  );
};
