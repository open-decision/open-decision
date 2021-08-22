import {
  Box,
  Input,
  IconButton,
  Text,
  styled,
} from "@open-legal-tech/design-system";
import {
  ChevronDownIcon,
  CornerBottomLeftIcon,
  TrashIcon,
  TriangleDownIcon,
} from "@radix-ui/react-icons";
import * as React from "react";
import * as Accordion from "@radix-ui/react-accordion";

const StyledAccordionContainer = styled(Accordion.Item, {
  display: "grid",
  gridTemplateColumns: "50px 1fr 50px",

  "&[data-state=open]": {
    gridTemplateRows: "1fr 1fr",
  },
  "&[data-state=closed]": {
    gridTemplateRows: "1fr",
  },
});

const StyledAccordionContent = styled(Accordion.Content, {
  gridColumn: "1 / -1",
  display: "grid",
  gridTemplateColumns: "inherit",
  alignItems: "center",
});

export type Input = { id: string; value: string; position: number };

type SingleSelectInputProps = Input & {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onDelete: (id: string) => void;
};

export function SingleSelectInput({
  id,
  value,
  position,
  onChange,
  onDelete,
}: SingleSelectInputProps): JSX.Element {
  return (
    <StyledAccordionContainer value={id}>
      <Accordion.Header
        as={Box}
        css={{
          display: "grid",
          gridColumn: "1 / -1",
          gridTemplateColumns: "inherit",
          $$radius: "$radii$lg",
          $$border: "2px solid $colors$gray5",
        }}
      >
        <Accordion.Trigger
          css={{
            border: "$$border",
            borderRadius: "$none",
            borderTopLeftRadius: "$$radius",
            borderBottomLeftRadius: "$$radius",
          }}
          as={IconButton}
          label="Öffne die Verbindungen"
          variant="ghost"
          Icon={<ChevronDownIcon />}
        >
          {position}
        </Accordion.Trigger>
        <Input
          css={{
            marginRight: "$2",
            boxShadow: "$none",
            border: "$$border",
            borderLeft: "$none",
            gridColumn: 2,
            borderTopRightRadius: "$$radius",
            borderBottomRightRadius: "$$radius",
          }}
          value={value}
          onChange={onChange}
        />
        <IconButton
          css={{ colorScheme: "error", gridColumn: 3 }}
          variant="tertiary"
          label="Entferne den Input"
          Icon={
            <TrashIcon
              style={{
                width: "30px",
                height: "30px",
              }}
            />
          }
          onClick={(_event) => onDelete(id)}
        />
      </Accordion.Header>
      <StyledAccordionContent>
        <CornerBottomLeftIcon
          style={{
            width: "30px",
            height: "30px",
            transform: "translate(10px, -6px)",
          }}
        />
        <Box css={{ gridColumn: 2, display: "flex", gap: "$4" }}>
          <Text>GEHT ZU:</Text>
          <Text>
            Knoten 2 <TriangleDownIcon style={{ display: "inline" }} />
          </Text>
        </Box>
      </StyledAccordionContent>
    </StyledAccordionContainer>
  );
}
