import { Box, IconButton, styled } from "@open-legal-tech/design-system";
import { Type } from "react-feather";
import * as React from "react";
import * as Separator from "@radix-ui/react-separator";
import { insertLink } from "./utils";
import { useSlateStatic } from "slate-react";
import {
  toggleBooleanMark,
  toggleElement,
  toggleElementUnionMark,
} from "./formatting";
import {
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Link,
  List,
  Underline,
} from "react-feather";

const StyledSeparator = styled(Separator.Root, {
  backgroundColor: "$gray8",
  "&[data-orientation=horizontal]": { height: 1 },
  "&[data-orientation=vertical]": { width: 1 },
});

export function Toolbar(): JSX.Element {
  const editor = useSlateStatic();
  const toggleEditorMark = toggleBooleanMark(editor);
  const toggleEditorElement = toggleElement(editor);
  const toggleEditorElementUnionMark = toggleElementUnionMark(editor);

  return (
    <Box
      css={{
        display: "flex",
        backgroundColor: "$gray2",
        padding: "$1",
        boxShadow: "$1",
        gap: "$1",
      }}
    >
      <IconButton
        size="small"
        variant="ghost"
        label="Konvertiere den ausgewählten Text in eine Überschrift"
        onClick={() => toggleEditorElement("h1")}
        Icon={<Type />}
      />
      <StyledSeparator orientation="vertical" decorative />
      <IconButton
        size="small"
        variant="ghost"
        label="Markiere den ausgewählten Text dick"
        onClick={() => toggleEditorMark("bold")}
        Icon={<Bold />}
      />
      <IconButton
        size="small"
        variant="ghost"
        label="Markiere den ausgewählten Text kursiv"
        onClick={() => toggleEditorMark("italic")}
        Icon={<Italic />}
      />
      <IconButton
        size="small"
        variant="ghost"
        label="Unterstreiche den ausgewählten Text"
        onClick={() => toggleEditorMark("underline")}
        Icon={<Underline />}
      />
      <StyledSeparator orientation="vertical" decorative />
      <IconButton
        size="small"
        variant="ghost"
        label="Erstelle eine unnumerierte Liste"
        onClick={() => toggleEditorElement("ul")}
        Icon={<List />}
      />
      <StyledSeparator orientation="vertical" decorative />
      <IconButton
        size="small"
        variant="ghost"
        label="Orientiere den ausgewählten Block links"
        onClick={() => toggleEditorElementUnionMark("justify", "left")}
        Icon={<AlignLeft />}
      />
      <IconButton
        size="small"
        variant="ghost"
        label="Orientiere den ausgewählten Block mittig"
        onClick={() => toggleEditorElementUnionMark("justify", "center")}
        Icon={<AlignJustify />}
      />
      <IconButton
        size="small"
        variant="ghost"
        label="Orientiere den ausgewählten Block rechts"
        onClick={() => toggleEditorElementUnionMark("justify", "right")}
        Icon={<AlignRight />}
      />
      <StyledSeparator orientation="vertical" decorative />
      <IconButton
        size="small"
        variant="ghost"
        label="Füge einen neuen Link hinzu"
        onClick={() =>
          insertLink(editor, prompt("url") ?? "www.open-decision.org")
        }
        Icon={<Link />}
      />
    </Box>
  );
}
