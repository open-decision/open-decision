import { Box, Stack } from "@open-decision/design-system";
import { useInterpreter } from "@open-decision/interpreter";
import { RichTextRenderer } from "components/RichTextEditor/RichTextRenderer";
import { Separator } from "components/Separator";
import { InfoBox } from "features/Notifications/InfoBox";
import * as React from "react";
import { AnswersForm } from "./components/AnswersForm";
import { Navigation } from "./components/Navigation";

export function MobilePreview() {
  const { getCurrentNode } = useInterpreter();
  const node = getCurrentNode();

  if (!node) throw new Error(`The Preview could not retrieve the currentNode.`);

  return (
    <Box
      css={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        css={{
          width: "400px",
          height: "700px",
          backgroundColor: "$gray1",
          padding: "$8",
          borderRadius: "$md",
          display: "flex",
          flexDirection: "column",
          gap: "$6",
        }}
      >
        <Stack
          css={{
            gridColumn: "2",
            height: "100%",
          }}
        >
          <Stack css={{ flex: 1, gap: "$3" }}>
            {node.data.content ? (
              <RichTextRenderer content={node.data.content} key={node.id} />
            ) : (
              <InfoBox
                content="Die Frage enthält keinen Text"
                title="Fehlende Daten"
                variant="warning"
                css={{ boxShadow: "$1" }}
              />
            )}
            <Separator />
            <AnswersForm inputIds={node.data.inputs} key={`form_${node.id}`} />
          </Stack>
          <Stack css={{ alignItems: "center" }}>
            <Navigation />
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
