import {
  Box,
  Button,
  Icon,
  styled,
  ToggleButton,
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
  backgroundColor: "$gray2",
  padding: "$1",
  boxShadow: "$1",
  gap: "$1",
  height: "50px",
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
      >
        <Icon
          size="small"
          label="Konvertiere den ausgewählten Text in eine Überschrift"
        >
          {isHeading ? <Type /> : <HeadingIcon />}
        </Icon>
      </Button>

      <StyledSeparator orientation="vertical" decorative />
      <ToggleButton
        pressed={isMarkActive("bold")}
        onClick={() => toggleEditorMark("bold")}
      >
        <Icon size="small" label="Markiere den ausgewählten Text fett">
          <Bold />
        </Icon>
      </ToggleButton>
      <ToggleButton
        pressed={isMarkActive("italic")}
        onClick={() => toggleEditorMark("italic")}
      >
        <Icon size="small" label="Markiere den ausgewählten Text kursiv">
          <Italic />
        </Icon>
      </ToggleButton>
      <ToggleButton
        pressed={isMarkActive("underline")}
        onClick={() => toggleEditorMark("underline")}
      >
        <Icon size="small" label="Unterstreiche den ausgewählten Text">
          <Underline />
        </Icon>
      </ToggleButton>
      <ToggleButton
        pressed={isList}
        onClick={() => toggleListElement("unordered_list")}
      >
        <Icon label="Erstelle eine unnumerierte Liste">
          <List />
        </Icon>
      </ToggleButton>

      <ToggleButton
        pressed={isNumberedList}
        onClick={() => toggleListElement("ordered_list")}
      >
        <Icon size="small" label="Erstelle eine numerierte Liste">
          <QuestionMarkIcon />
        </Icon>
      </ToggleButton>
      <StyledSeparator orientation="vertical" decorative />
      <ToggleButton
        pressed={isLink}
        onMouseDown={(event) => {
          event.preventDefault();
          return toggleLink(editor);
        }}
      >
        <Icon size="small" label="Erstelle eine numerierte Liste">
          <Link />
        </Icon>
      </ToggleButton>
    </StyledToolbar>
  );
}
