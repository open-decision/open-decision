import * as React from "react";
import { Stack, stackClasses } from "@open-decision/design-system";
import { sidebarCardClasses } from "@open-decision/node-editor";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { DecisionNodePlugin } from "../DecisionNodePlugin";
import { InputHeader } from "./InputHeader";
import { TDecisionNodeInputs } from "../createInputPlugins";
import { TInputId } from "@open-decision/plugins-node-helpers";
import { TNodeId } from "@open-decision/tree-type";

const DecisionNode = new DecisionNodePlugin();

export type InputPluginComponentProps = {
  inputId?: TInputId;
  nodeId: TNodeId;
};

export function InputPlugin({ inputId, nodeId }: InputPluginComponentProps) {
  const input = useTree((treeClient) => {
    if (!inputId) return undefined;
    const input = treeClient.pluginEntity.get.single<TDecisionNodeInputs>(
      "inputs",
      inputId
    );

    if (!input) return undefined;

    return input;
  });

  const treeClient = useTreeClient();

  if (!inputId) {
    const newInput = DecisionNode.inputPlugins.plugins.select.create({});

    treeClient.pluginEntity.add("inputs", newInput);
    DecisionNode.connectInputAndNode(nodeId, newInput.id)(treeClient);
  }

  const InputComponents = input
    ? DecisionNode.inputPlugins.Builder[input.type]
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
