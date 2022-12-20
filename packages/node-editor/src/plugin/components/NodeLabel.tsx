import { rowClasses, WithClassNameArray } from "@open-decision/design-system";

export type NodeLabelProps = WithClassNameArray<
  React.HTMLAttributes<HTMLSpanElement>
>;

export const NodeLabel = ({
  className,
  classNames,
  ...props
}: NodeLabelProps) => {
  return (
    <span
      className={rowClasses({}, [
        "rounded-md bg-success2 small-text items-center gap-1 p-1 border border-success7 text-colorScheme12",
        classNames,
        className,
      ])}
      {...props}
    />
  );
};
