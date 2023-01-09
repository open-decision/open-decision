import * as React from "react";
import { Stack, stackClasses } from "@open-decision/design-system";
import { sidebarCardClasses } from "@open-decision/node-editor";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { DecisionNodePlugin } from "../decisionNodePlugin";
import { InputHeader } from "./InputHeader";

const DecisionNode = new DecisionNodePlugin();

export type InputPluginComponentProps = {
  inputId?: string;
  nodeId: string;
};

export function InputPlugin({ inputId, nodeId }: InputPluginComponentProps) {
  const input = useTree((treeClient) => {
    if (!inputId) return undefined;
    return treeClient.pluginEntity.get.single<typeof DecisionNode.inputType>(
      "inputs",
      inputId
    );
  });

  const treeClient = useTreeClient();

  if (!inputId) {
    const newInput = DecisionNode.inputPlugins.select.plugin.create({});

    treeClient.pluginEntity.add("inputs", newInput);
    DecisionNode.connectInputAndNode(nodeId, newInput.id)(treeClient);
  }

  const InputComponents = input
    ? DecisionNode.inputPlugins[input.type].BuilderComponent
    : null;

  const Header = ({ children }: { children?: React.ReactNode }) => (
    <InputHeader inputId={inputId} nodeId={nodeId}>
      {children}
    </InputHeader>
  );

  return (
    <section key={inputId} className={stackClasses({}, sidebarCardClasses)}>
      <Stack>
        {!InputComponents || !inputId ? (
          <Header />
        ) : (
          <>
            <Header>
              {InputComponents.PrimaryActionSlot ? (
                <InputComponents.PrimaryActionSlot inputId={inputId} />
              ) : null}
            </Header>
            {InputComponents.InputConfigurator ? (
              <InputComponents.InputConfigurator
                inputId={inputId}
                withRequiredOption={false}
              />
            ) : null}
          </>
        )}
      </Stack>
    </section>
  );
}
