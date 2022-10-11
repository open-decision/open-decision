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
import { Navigation } from "./components/Navigation";
import { InputPluginObject } from "@open-decision/input-plugins-helpers";
import { NodePluginObject } from "@open-decision/node-editor";

export type RendererProps = {
  css?: StyleObject;
  nodeId?: string;
  nodePlugins: Record<string, NodePluginObject<any, any, any>>;
  inputPlugins: Record<string, InputPluginObject<any, any, any>>;
} & StackProps;

function RendererImpl(
  { css, nodePlugins, inputPlugins, ...props }: RendererProps,
  ref: React.Ref<HTMLDivElement>
) {
  const { getCurrentNode } = useInterpreter();
  const node = getCurrentNode();
  const Node = nodePlugins[node.type].Renderer;

  if (!Node) return null;

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
            <Node.Content node={node} />
            <ScrollArea.Scrollbar />
          </ScrollArea.Viewport>
        </ScrollArea.Root>
        {Node.Actions ? (
          <Node.Actions
            css={{ paddingInline: "$$padding", marginTop: "$4" }}
            inputPlugins={inputPlugins}
            node={node}
          />
        ) : null}
      </Stack>
      <Navigation css={{ alignSelf: "center", marginBottom: "$$padding" }} />
    </Stack>
  );
}

export const View = React.forwardRef(RendererImpl);

export const Root = ({ children, ...props }: InterpreterProviderProps) => {
  return <InterpreterProvider {...props}>{children}</InterpreterProvider>;
};
