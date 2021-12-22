import {
  Box,
  Icon,
  styled,
  ToggleButton,
  Button,
} from "@open-legal-tech/design-system";
import { Type } from "react-feather";
import * as React from "react";
import * as Separator from "@radix-ui/react-separator";
import { useSlate } from "slate-react";
import {
  isBooleanMarkActive,
  isElement,
  toggleBooleanMark,
  toggleElement,
  toggleList,
} from "./formatting";
import { Bold, Italic, Link, List, Underline } from "react-feather";
import { HeadingIcon, QuestionMarkIcon } from "@radix-ui/react-icons";
import { toggleLink } from "./contentTypes/link";

const StyledSeparator = styled(Separator.Root, {
  backgroundColor: "$gray8",
  "&[data-orientation=horizontal]": { height: 1 },
  "&[data-orientation=vertical]": { width: 1 },
});

const StyledToolbar = styled(Box, {
  display: "flex",
  alignItems: "center",
  backgroundColor: "$gray2",
  padding: "$2 $1",
  boxShadow: "$1",
  gap: "$1",
});

const ToolbarButton = styled(ToggleButton, {
  "&:hover": {
    backgroundColor: "$gray4",
  },

  "&:active, &[data-active='true'], &[data-state=on]": {
    color: "$gray12 !important",
    backgroundColor: "$gray6 !important",
  },
});

export function Toolbar({
  css,
  ...props
}: React.ComponentProps<typeof StyledToolbar>): JSX.Element {
  const editor = useSlate();
  const toggleEditorMark = toggleBooleanMark(editor);
  const toggleEditorElement = toggleElement(editor);
  const toggleListElement = toggleList(editor);

  const isMarkActive = isBooleanMarkActive(editor);
  const isHeading = isElement(editor)("heading");
  const isNumberedList = isElement(editor)("ordered_list");
  const isList = isElement(editor)("unordered_list");
  const isLink = isElement(editor)("link");

  return (
    <StyledToolbar css={css} {...props}>
      <Button
        size="small"
        variant="ghost"
        square
        onClick={() =>
          isHeading
            ? toggleEditorElement("paragraph")
            : toggleEditorElement("heading")
        }
        css={{
          "&:hover": {
            backgroundColor: "$gray4",
          },
        }}
      >
        <Icon label="Konvertiere den ausgewählten Text in eine Überschrift">
          {isHeading ? <Type /> : <HeadingIcon />}
        </Icon>
      </Button>
      <StyledSeparator
        orientation="vertical"
        decorative
        css={{ alignSelf: "stretch" }}
      />
      <ToolbarButton
        square
        pressed={isMarkActive("bold")}
        onClick={() => toggleEditorMark("bold")}
      >
        <Icon size="small" label="Markiere den ausgewählten Text fett">
          <Bold />
        </Icon>
      </ToolbarButton>
      <ToolbarButton
        square
        pressed={isMarkActive("italic")}
        onClick={() => toggleEditorMark("italic")}
      >
        <Icon size="small" label="Markiere den ausgewählten Text kursiv">
          <Italic />
        </Icon>
      </ToolbarButton>
      <ToolbarButton
        square
        pressed={isMarkActive("underline")}
        onClick={() => toggleEditorMark("underline")}
      >
        <Icon size="small" label="Unterstreiche den ausgewählten Text">
          <Underline />
        </Icon>
      </ToolbarButton>
      <ToolbarButton
        square
        pressed={isList}
        onClick={() => toggleListElement("unordered_list")}
      >
        <Icon size="small" label="Erstelle eine unnumerierte Liste">
          <List />
        </Icon>
      </ToolbarButton>

      <ToolbarButton
        square
        pressed={isNumberedList}
        onClick={() => toggleListElement("ordered_list")}
      >
        <Icon size="small" label="Erstelle eine numerierte Liste">
          <QuestionMarkIcon />
        </Icon>
      </ToolbarButton>
      <StyledSeparator
        orientation="vertical"
        decorative
        css={{ alignSelf: "stretch" }}
      />
      <ToolbarButton
        square
        pressed={isLink}
        onMouseDown={(event) => {
          event.preventDefault();
          return toggleLink(editor);
        }}
      >
        <Icon size="small" label="Erstelle eine numerierte Liste">
          <Link />
        </Icon>
      </ToolbarButton>
    </StyledToolbar>
  );
}
