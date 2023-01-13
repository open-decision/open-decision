import * as React from "react";
import {
  ClassNameArrayProp,
  Form as SystemForm,
  ScrollArea,
  Stack,
  twMerge,
} from "@open-decision/design-system";
import { Navigation } from "./Navigation";
import { useInterpreterTree } from "@open-decision/interpreter-react";
import { mapKeys } from "remeda";

type RendererContentAreaProps = {
  children: React.ReactNode;
  className?: string;
};

export function ContentArea({ children, className }: RendererContentAreaProps) {
  return (
    <ScrollArea.Root
      className={twMerge("flex flex-col overflow-hidden", className)}
      scrollHideDelay={1000000}
    >
      <ScrollArea.Viewport className="min-h-0 p-4 -ml-2">
        <Stack className="gap-4">{children}</Stack>
        <ScrollArea.Scrollbar />
      </ScrollArea.Viewport>
    </ScrollArea.Root>
  );
}

type RendererContainerProps = {
  children: React.ReactNode;
  withNavigation?: boolean;
  nodeId: string;
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
}: RendererContainerProps) {
  const theme = useInterpreterTree((treeClient) => treeClient.get.tree().theme);
  const node = useInterpreterTree((treeClient) =>
    treeClient.nodes.get.single(nodeId)
  );

  if (node instanceof Error) throw node;

  return (
    <Stack
      classNames={[`rounded-md overflow-hidden w-full`, classNames, className]}
      style={mapKeys(theme ?? {}, (key) => `--${key}`) as React.CSSProperties}
    >
      <Stack className="flex-1 overflow-hidden mb-4 px-1 pb-1 gap-4">
        {children}
      </Stack>
      {withNavigation && !node.final ? (
        <Navigation
          className="self-center mb-[var(--padding)]"
          successButtonLabel={successButtonLabel}
        />
      ) : null}
    </Stack>
  );
}

type RendererFormProps<TFieldValues extends SystemForm.FieldValues> = {
  children?: React.ReactNode;
} & SystemForm.RootProps<TFieldValues>;

export function Form<TFieldValues extends SystemForm.FieldValues>({
  children,
  ...props
}: RendererFormProps<TFieldValues>) {
  return (
    <SystemForm.Root className="gap-8" id="form" {...props}>
      {children}
    </SystemForm.Root>
  );
}
