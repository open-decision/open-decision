import { ScrollArea, Stack, StyleObject } from "@open-decision/design-system";
import * as React from "react";
import {
  InterpreterProvider,
  InterpreterProviderProps,
  useInterpreter,
} from "@open-decision/interpreter-react";
import { AnswersForm } from "./components/AnswersForm";
import { RichTextRenderer } from "@open-decision/rich-text-editor";
import { Navigation } from "./components/Navigation";

export type RendererProps = {
  css?: StyleObject;
  nodeId?: string;
};

function RendererImpl(
  { css, nodeId }: RendererProps,
  ref: React.Ref<HTMLDivElement>
) {
  const { getCurrentNode, getInputs, getNode } = useInterpreter();
  const node = nodeId ? getNode(nodeId) : getCurrentNode();

  if (!node) throw node;
  const inputs = getInputs(node.data.inputs);

  return (
    <Stack
      css={{
        borderRadius: "$md",
        overflow: "hidden",
        ...css,
      }}
    >
      <Stack css={{ flex: 1, overflow: "hidden", marginBottom: "$5" }}>
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
          <ScrollArea.Viewport
            css={{
              minHeight: 0,
            }}
          >
            {node.data.content ? (
              <>
                <RichTextRenderer content={node.data.content} key={node.id} />
                <ScrollArea.Scrollbar />
              </>
            ) : null}
          </ScrollArea.Viewport>
        </ScrollArea.Root>
        {inputs ? (
          <AnswersForm
            inputs={inputs}
            key={`form_${node.id}`}
            css={{ paddingInline: "$$padding", marginTop: "$4" }}
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
