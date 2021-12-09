import {
  Box,
  Button,
  Icon,
  styled,
  StyleObject,
} from "@open-legal-tech/design-system";
import * as React from "react";
import { ThemingButton } from "./components/ThemingButton";
import { BuilderInterpreter } from "@open-decision/interpreter";
import { RichTextEditor } from "components";
import { useTree } from "features/Builder/state/useTree";

const Container = styled(Box, {
  position: "relative",
  display: "grid",
  gridTemplateColumns: "1fr 2fr 1fr",
});

type Props = { css?: StyleObject; InterpreterInstance: BuilderInterpreter };

export function Preview({ InterpreterInstance, css }: Props) {
  const [currentNode, setCurrentNode] = React.useState(
    InterpreterInstance.getCurrentNode()
  );
  const [node, send] = useTree((state) => state.nodes[currentNode.id]);

  return (
    <Container css={css}>
      <ThemingButton css={{ position: "absolute", top: 28, left: 28 }} />
      <Box css={{ marginTop: "$9", gridColumn: "2" }}>
        <RichTextEditor.Root
          value={node.content}
          setValue={(newValue) =>
            send({
              type: "updateNode",
              id: currentNode.id,
              node: { content: newValue },
            })
          }
          css={{ marginBottom: "$4" }}
        >
          <RichTextEditor.Toolbar
            css={{
              marginBottom: "$2",
              maxWidth: "max-content",
              borderRadius: "$md",
            }}
          />
          <RichTextEditor.Editable />
        </RichTextEditor.Root>
        <Box
          css={{
            marginBottom: "$8",
            gap: "$2",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {Object.values(currentNode.relations).map((relation) => (
            <Button
              key={relation.id}
              variant="tertiary"
              css={{
                minWidth: "200px",
                justifyContent: "start",
                gap: "$3",
                boxShadow: "$1",
                padding: "$2 $3",
              }}
              onClick={() => {
                const result = InterpreterInstance.evaluateUserInput(relation);

                return setCurrentNode(result);
              }}
            >
              <Icon
                label="Klicke A zum auswählen"
                css={{
                  border: "1px solid $colorScheme9",
                  padding: "$2",
                  borderRadius: "$md",
                }}
              >
                A
              </Icon>
              {relation.answer}
            </Button>
          ))}
        </Box>
        {InterpreterInstance.hasHistory ? (
          <Button
            variant="secondary"
            onClick={() => {
              const result = InterpreterInstance.goBack();
              return setCurrentNode(result);
            }}
          >
            Zurück
          </Button>
        ) : null}
      </Box>
    </Container>
  );
}
