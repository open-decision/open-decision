import * as React from "react";
import { SingleSelectInput } from "./SingleSelectInput";
import * as Accordion from "@radix-ui/react-accordion";
import {
  Heading,
  Box,
  IconButton,
  styled,
} from "@open-legal-tech/design-system";
import { PlusIcon } from "@radix-ui/react-icons";
import { useTree } from "features/Builder/state/useTree";
import { TNode } from "features/Builder/types";

const StyledAccordionRoot = styled(Accordion.Root, {
  display: "grid",
  gap: "$2",
});

type SingleSelectProps = { node: TNode };

export function SingleSelect({ node }: SingleSelectProps) {
  const service = useTree();

  return (
    <>
      <Box
        css={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Heading className="text-lg font-semibold">
          Pfade{" "}
          <Box css={{ color: "$gray11" }} as="span">
            / Einfachauswahl
          </Box>
        </Heading>
        <IconButton
          variant="tertiary"
          css={{ colorScheme: "success" }}
          Icon={<PlusIcon style={{ width: "30px", height: "30px" }} />}
          label="Neue Antwortmöglichkeit hinzufügen"
          onClick={() => service.send({ type: "addInput", nodeId: node.id })}
        />
      </Box>
      <StyledAccordionRoot type="multiple">
        {node.content.inputs.map((input) => (
          <SingleSelectInput
            key={input.id}
            onChange={(event) =>
              service.send({
                type: "updateInput",
                nodeId: node.id,
                inputId: input.id,
                input: { value: event.target.value },
              })
            }
            onDelete={() =>
              service.send({
                type: "deleteInput",
                nodeId: node.id,
                inputId: input.id,
              })
            }
            {...input}
          />
        ))}
      </StyledAccordionRoot>
    </>
  );
}
