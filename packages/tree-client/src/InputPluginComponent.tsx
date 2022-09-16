import * as React from "react";
import { createTreeClient, TTreeClient } from "./createTreeClient";
import {
  DropdownMenu,
  Box,
  Label,
  Heading,
  Stack,
} from "@open-decision/design-system";
import {
  useInputs,
  useTreeClient,
  useTreeContext,
} from "@open-decision/tree-sync";
import { z } from "zod";
import { SingleSelectInput } from "@open-decision/input-plugins-select";
import { InputComponentProps } from "@open-decision/input-plugins-helpers";
import { FreeTextInput } from "@open-decision/input-plugins-free-text";

type InputHeaderProps = {
  children?: React.ReactNode;
  currentType?: TTreeClient["inputs"]["types"][number];
  inputId: string;
  treeClient: TTreeClient;
};

const InputHeader = ({
  children,
  currentType,
  inputId,
  treeClient,
}: InputHeaderProps) => {
  return (
    <Box
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "$2",
        marginBottom: "$3",
      }}
    >
      <Label as="h2" css={{ margin: 0, display: "block" }}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <DropdownMenu.Button
              alignByContent="left"
              variant="neutral"
              size="small"
              css={{ textStyle: "medium-text" }}
            >
              {/* FIXME missing input types */}
              {currentType
                ? currentType.charAt(0).toUpperCase() + currentType.slice(1)
                : "Kein Input Typ ausgewählt"}
            </DropdownMenu.Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start">
            {treeClient.inputs.types.map((type) => {
              return (
                <DropdownMenu.CheckboxItem
                  key={type}
                  checked={currentType === type}
                  onClick={() => {
                    const newInput = treeClient.input[type].create({});
                    return treeClient.inputs.update.type(inputId, newInput);
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </DropdownMenu.CheckboxItem>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Label>
      {children}
    </Box>
  );
};

type InputPluginComponentProps = {
  inputIds: string[];
  nodeId: string;
} & Pick<InputComponentProps<any>, "onClick">;

export function InputPluginComponent({
  inputIds,
  onClick,
  nodeId,
}: InputPluginComponentProps) {
  const inputs = useInputs(inputIds) as unknown as Record<
    string,
    z.infer<TTreeClient["inputs"]["Type"]>
  >;

  const baseTreeClient = useTreeClient();
  const {
    tree: { tree },
  } = useTreeContext();

  const extendedTreeClient = createTreeClient(tree);

  return (
    <Box as="section">
      {inputs ? (
        Object.values(inputs).map((input) => {
          return (
            <Box as="section" key={input.id}>
              {(() => {
                switch (input.type) {
                  case "select": {
                    return (
                      <>
                        <InputHeader
                          currentType={input.type}
                          inputId={input.id}
                          treeClient={extendedTreeClient}
                        >
                          <SingleSelectInput.PrimaryActionSlot
                            input={input}
                            treeClient={baseTreeClient}
                          />
                        </InputHeader>
                        <SingleSelectInput.Component
                          nodeId={nodeId}
                          onClick={onClick}
                          input={input}
                          key={input.id}
                          treeClient={baseTreeClient}
                        />
                      </>
                    );
                  }

                  case "freeText": {
                    return (
                      <>
                        <InputHeader
                          currentType={input.type}
                          inputId={input.id}
                          treeClient={extendedTreeClient}
                        />
                        <FreeTextInput.Component
                          input={input}
                          nodeId={nodeId}
                          onClick={() => null}
                          key={input.id}
                          treeClient={baseTreeClient}
                        />
                      </>
                    );
                  }

                  default:
                    return null;
                }
              })()}
            </Box>
          );
        })
      ) : (
        <Stack>
          <Heading>Eingabe erstellen</Heading>
        </Stack>
      )}
    </Box>
  );
}
