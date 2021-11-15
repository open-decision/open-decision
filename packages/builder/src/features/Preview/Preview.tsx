import {
  Box,
  Button,
  Heading,
  Icon,
  styled,
  StyleObject,
  Text,
} from "@open-legal-tech/design-system";
import * as React from "react";
import { ThemingButton } from "./components/ThemingButton";

const Container = styled(Box, {
  position: "relative",
  display: "grid",
  gridTemplateColumns: "1fr 2fr 1fr",
});

type Props = { css?: StyleObject };

export function Preview({ css }: Props) {
  return (
    <Container css={css}>
      <ThemingButton css={{ position: "absolute", top: 28, left: 28 }} />
      <Box css={{ marginTop: "$9", gridColumn: "2" }}>
        <Heading css={{ marginBottom: "$3" }}>
          Dies ist eine Überschrift
        </Heading>
        <Text css={{ marginBottom: "$5" }}>Dies ist ein Text darunter</Text>
        <Box css={{ marginBottom: "$8" }}>
          <Button
            variant="tertiary"
            css={{
              width: "100%",
              justifyContent: "start",
              gap: "$3",
              boxShadow: "$1",
              padding: "$2 $3",
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
            Antwort 1
          </Button>
        </Box>
        <Button variant="secondary">Zurück</Button>
      </Box>
    </Container>
  );
}
