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
import { TInput } from "features/Builder/types";
import { updateElement } from "features/Builder/hooks/createTreeMachine";

const StyledAccordionRoot = styled(Accordion.Root, {
  display: "grid",
  gap: "$2",
});

type SingleSelectProps = { inputs: TInput[]; update: updateElement };

export function SingleSelect({ inputs, update }: SingleSelectProps) {
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
          // onClick={() =>
          //   setInputs([
          //     ...inputs,
          //     {
          //       id: nanoid(5),
          //       value: "",
          //       position: 1,
          //     },
          //   ])
          // }
        />
      </Box>
      <StyledAccordionRoot type="multiple">
        {inputs.map((input) => (
          <SingleSelectInput key={input.id} {...input} />
        ))}
      </StyledAccordionRoot>
    </>
  );
}
