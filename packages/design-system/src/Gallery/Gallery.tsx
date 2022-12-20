import * as React from "react";
import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { twMerge } from "../utils";

const gap = 50;
const outerBoxClasses =
  "grid grid-cols-2 items-center gap-4 md:grid-cols-[50px_auto_50px]";
const innerBoxClasses =
  "flex overflow-x-auto overflow-y-hidden gap-[50px] col-span-full h-full md:col-span-2";
const setClasses =
  "flex-grow flex-shrink-0 basis-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 py-4";
const arrowButtonClasses =
  "cursor-pointer flex flex-col justify-center p-2 select-none md:order-[revert]";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export type ContainerProps = React.ComponentProps<typeof Container>;

export function Container({ children, className, ...props }: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  return (
    <div
      className={
        className ? twMerge(outerBoxClasses, className) : outerBoxClasses
      }
      {...props}
    >
      <Button
        variant="neutral"
        className={arrowButtonClasses}
        style={{ order: "2" }}
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
      </Button>
      <div className={innerBoxClasses} ref={ref}>
        {children}
      </div>
      <Button
        variant="neutral"
        className={arrowButtonClasses}
        style={{ order: "2" }}
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
      </Button>
    </div>
  );
}

// ------------------------------------------------------------------
// Set
export type SetProps = { children: React.ReactNode; className?: string };

export const Set = ({ className, children }: SetProps) => {
  return (
    <div className={className ? twMerge(setClasses, className) : setClasses}>
      {children}
    </div>
  );
};

// ------------------------------------------------------------------
