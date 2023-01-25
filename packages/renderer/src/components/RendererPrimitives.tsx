import * as React from "react";
import {
  ClassNameArrayProp,
  Form as SystemForm,
  Logo,
  ScrollArea,
  Separator,
  Stack,
  twMerge,
} from "@open-decision/design-system";
import { Navigation } from "./Navigation";
import { useInterpreterTree } from "@open-decision/interpreter-react";
import { mapKeys } from "remeda";
import { TNodeId } from "@open-decision/tree-id";

export type ContentAreaProps = {
  children: React.ReactNode;
  className?: string;
};

export function ContentArea({ children, className }: ContentAreaProps) {
  return (
    <ScrollArea.Root
      className={twMerge("flex flex-col overflow-hidden", className)}
    >
      <ScrollArea.Viewport className="p-6 pt-0">
        <Stack className="gap-6">{children}</Stack>
        <ScrollArea.Scrollbar />
      </ScrollArea.Viewport>
    </ScrollArea.Root>
  );
}

export type ContainerProps = {
  children: React.ReactNode;
  withNavigation?: boolean;
  nodeId: TNodeId;
  className?: string;
  classNames?: ClassNameArrayProp;
  successButtonLabel?: React.ReactNode;
};

export function Container({
  children,
  withNavigation = true,
  className,
  nodeId,
  successButtonLabel,
  classNames,
}: ContainerProps) {
  const theme = useInterpreterTree((treeClient) => treeClient.get.tree().theme);
  const node = useInterpreterTree((treeClient) =>
    treeClient.nodes.get.single(nodeId)
  );
  const startNodeId = useInterpreterTree((treeClient) =>
    treeClient.get.startNodeId()
  );

  if (!node) return null;

  return (
    <>
      <Stack className="p-2 px-4 lg:p-4 lg:px-8 self-start">
        <Logo className="w-[70px] lg:w-[100px]" />
      </Stack>
      <Stack
        classNames={[
          `rounded-md overflow-hidden w-full`,
          classNames,
          className,
        ]}
        style={mapKeys(theme ?? {}, (key) => `--${key}`) as React.CSSProperties}
      >
        <Stack className="flex-1 overflow-hidden lg:mt-4">{children}</Stack>
        <Separator className="m-0" />
        {withNavigation ? (
          <Navigation
            className="self-center"
            successButtonLabel={successButtonLabel}
            isStartNode={nodeId === startNodeId}
            isFinalNode={node.final}
          />
        ) : null}
      </Stack>
    </>
  );
}

export type FormProps<TFieldValues extends SystemForm.FieldValues> = {
  children?: React.ReactNode;
} & SystemForm.RootProps<TFieldValues>;

export function Form<TFieldValues extends SystemForm.FieldValues>({
  children,
  ...props
}: FormProps<TFieldValues>) {
  return (
    <SystemForm.Root className="gap-8 h-full" id="form" {...props}>
      {children}
    </SystemForm.Root>
  );
}
