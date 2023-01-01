import { Stack } from "@open-decision/design-system";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export function SideMenu({ className, children }: Props) {
  return (
    <Stack
      classNames={[
        "py-3 items-center border-r border-gray7 w-[56px]",
        className,
      ]}
    >
      {children}
    </Stack>
  );
}
