import {
  ScrollArea,
  Stack,
  StackProps,
  StyleObject,
} from "@open-decision/design-system";
import * as React from "react";
import {
  InterpreterProvider,
  InterpreterProviderProps,
  useInterpreter,
} from "@open-decision/interpreter-react";
import { RichTextRenderer } from "@open-decision/rich-text-editor";
import { Navigation } from "./components/Navigation";
import { RendererPlugin } from "@open-decision/tree-client";

export type RendererProps = {
  css?: StyleObject;
  nodeId?: string;
} & StackProps;

function RendererImpl(
  { css, ...props }: RendererProps,
  ref: React.Ref<HTMLDivElement>
) {
  const { getCurrentNode } = useInterpreter();
  const node = getCurrentNode();

  return (
    <Stack
      css={{
        borderRadius: "$md",
        overflow: "hidden",
        width: "100%",
        ...css,
      }}
      {...props}
    >
      <Stack
        css={{
          flex: 1,
          overflow: "hidden",
          marginBottom: "$5",
          paddingInline: "$1",
        }}
      >
        <ScrollArea.Root
          css={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            padding: "$$padding",
            paddingBottom: "0",
          }}
          ref={ref}
        >
          <ScrollArea.Viewport css={{ minHeight: 0 }}>
            {node.content ? (
              <>
                <RichTextRenderer content={node.content} key={node.id} />
                <ScrollArea.Scrollbar />
              </>
            ) : null}
          </ScrollArea.Viewport>
        </ScrollArea.Root>
        <RendererPlugin
          inputIds={node.inputs}
          css={{ paddingInline: "$$padding", marginTop: "$4" }}
        />
      </Stack>
      <Navigation css={{ alignSelf: "center", marginBottom: "$$padding" }} />
    </Stack>
  );
}

export const View = React.forwardRef(RendererImpl);

export const Root = ({ children, ...props }: InterpreterProviderProps) => {
  return <InterpreterProvider {...props}>{children}</InterpreterProvider>;
};
