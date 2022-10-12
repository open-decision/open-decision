import * as React from "react";
import { TTreeClient } from "@open-decision/tree-client";
import { DropdownMenu, Box, Label } from "@open-decision/design-system";
import { getInputs } from "@open-decision/tree-type";
import { useTree } from "@open-decision/tree-sync";
import {
  InputComponentProps,
  InputPluginObject,
} from "@open-decision/input-plugins-helpers";

type InputDropdownProps = {
  currentType?: string;
  treeClient: TTreeClient;
  inputId?: string;
  nodeId: string;
  inputPlugins: Record<string, InputPluginObject<any, string, any>>;
};

const InputDropdown = ({
  currentType,
  treeClient,
  inputId,
  nodeId,
  inputPlugins,
}: InputDropdownProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <DropdownMenu.Button
          alignByContent="left"
          variant="neutral"
          size="small"
          css={{ textStyle: "medium-text" }}
        >
          {currentType
            ? currentType.charAt(0).toUpperCase() + currentType.slice(1)
            : "Kein Input Typ ausgewählt"}
        </DropdownMenu.Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start">
        {Object.values(inputPlugins).map((plugin) => {
          return (
            <DropdownMenu.CheckboxItem
              key={plugin.type}
              checked={currentType === plugin.type}
              onClick={() => {
                const newInput = plugin.plugin.create({});

                if (!inputId) {
                  treeClient.inputs.add(newInput);
                  return treeClient.inputs.connect.toNode(nodeId, newInput.id);
                }

                return treeClient.inputs.update.type(inputId, newInput);
              }}
            >
              {plugin.type.charAt(0).toUpperCase() + plugin.type.slice(1)}
            </DropdownMenu.CheckboxItem>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

type InputHeaderProps = {
  children?: React.ReactNode;
} & InputDropdownProps;

const InputHeader = ({ children, ...props }: InputHeaderProps) => {
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
        <InputDropdown {...props} />
      </Label>
      {children}
    </Box>
  );
};

type InputPluginComponentProps = {
  inputIds: string[];
  nodeId: string;
  treeClient: TTreeClient;
  inputPlugins: Record<string, InputPluginObject<any, any, any>>;
} & Pick<InputComponentProps<any>, "onClick">;

export function InputPluginComponent({
  inputIds,
  onClick,
  nodeId,
  treeClient,
  inputPlugins,
}: InputPluginComponentProps) {
  const inputs = useTree((tree) => getInputs(tree)(inputIds));

  return (
    <Box as="section">
      {inputs ? (
        Object.values(inputs).map((input) => {
          const PluginComponents = inputPlugins[input.type].BuilderComponent;

          return (
            <Box as="section" key={input.id}>
              <InputHeader
                nodeId={nodeId}
                currentType={input.type}
                inputId={input.id}
                treeClient={treeClient}
                inputPlugins={inputPlugins}
              >
                {PluginComponents.PrimaryActionSlot ? (
                  <PluginComponents.PrimaryActionSlot
                    input={input}
                    treeClient={treeClient}
                  />
                ) : null}
              </InputHeader>
              <PluginComponents.InputConfigurator
                nodeId={nodeId}
                onClick={onClick}
                input={input}
                key={input.id}
                treeClient={treeClient}
              />
            </Box>
          );
        })
      ) : (
        <InputHeader
          nodeId={nodeId}
          treeClient={treeClient}
          inputPlugins={inputPlugins}
        />
      )}
    </Box>
  );
}
