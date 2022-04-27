import { ScrollArea, Stack, StyleObject } from "@open-decision/design-system";
import * as React from "react";
import { useInterpreter } from "@open-decision/interpreter";
import { AnswersForm } from "./components/AnswersForm";
import { RichTextRenderer } from "components/RichTextEditor/RichTextRenderer";
import { Navigation } from "./components/Navigation";
import { Separator } from "components/Separator";
import { InfoBox } from "features/Notifications/InfoBox";

type Props = {
  css?: StyleObject;
};

function PreviewImpl({ css }: Props, ref: React.Ref<HTMLDivElement>) {
  const { getCurrentNode } = useInterpreter();
  const node = getCurrentNode();

  if (!node) throw new Error(`The Preview could not retrieve the currentNode.`);

  return (
    <Stack
      css={{
        borderRadius: "$md",
        overflow: "hidden",
        height: "100%",
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
            ) : (
              <InfoBox
                content="Die Frage enthält keinen Text"
                title="Fehlende Daten"
                variant="warning"
                css={{ boxShadow: "$1", marginBottom: "$3" }}
              />
            )}
          </ScrollArea.Viewport>
        </ScrollArea.Root>
        <AnswersForm
          inputIds={node.data.inputs}
          key={`form_${node.id}`}
          css={{ paddingInline: "$$padding", marginTop: "$4" }}
        />
      </Stack>
      <Navigation css={{ alignSelf: "center", marginBottom: "$$padding" }} />
    </Stack>
  );
}

export const Preview = React.forwardRef(PreviewImpl);
