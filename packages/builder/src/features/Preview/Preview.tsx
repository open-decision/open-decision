import { Box, Stack } from "@open-decision/design-system";
import * as React from "react";
import { useInterpreter } from "@open-decision/interpreter";
import { AnswersForm } from "./components/AnswersForm";
import { RichTextRenderer } from "components/RichTextEditor/RichTextRenderer";
import { Navigation } from "./components/Navigation";
import { Separator } from "components/Separator";
import { InfoBox } from "features/Notifications/InfoBox";

export function Preview() {
  const { getCurrentNode } = useInterpreter();
  const node = getCurrentNode();

  if (!node) throw new Error(`The Preview could not retrieve the currentNode.`);

  return (
    <Box
      css={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        height: "100%",
        layer: "3",
      }}
    >
      <Stack css={{ gridColumn: "2", marginBlock: "$10" }}>
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
  );
}
