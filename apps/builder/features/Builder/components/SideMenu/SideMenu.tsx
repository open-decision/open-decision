import { Stack } from "@open-decision/design-system";
import { Separator } from "@open-decision/design-system";
import { ViewToggle } from "./ViewToggle";

type Props = {
  className?: string;
  selectedView: string;
  children?: React.ReactNode;
};

export function SideMenu({ className, selectedView, children }: Props) {
  return (
    <Stack
      classNames={[
        "py-3 items-center border-r border-gray7 w-[56px]",
        className,
      ]}
    >
      <ViewToggle selectedView={selectedView} />
      <Separator className="w-[80%] mt-2" />
      {children}
    </Stack>
  );
}
