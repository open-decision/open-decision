import { labelClasses } from "@open-decision/design-system";
import { InputDropdown, TInputId } from "@open-decision/plugins-node-helpers";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { TNodeId } from "@open-decision/tree-type";
import { TDecisionNodeInputs } from "../createInputPlugins";
import { DecisionNodePlugin } from "../DecisionNodePlugin";

const DecisionNode = new DecisionNodePlugin();

export type InputHeaderProps = {
  children?: React.ReactNode;
  inputId?: TInputId;
  nodeId: TNodeId;
};

export function InputHeader({ children, inputId, nodeId }: InputHeaderProps) {
  const treeClient = useTreeClient();
  const inputType = useTree((treeClient) => {
    if (!inputId) return undefined;
    const input = treeClient.pluginEntity.get.single<TDecisionNodeInputs>(
      "inputs",
      inputId
    );

    if (!input) return undefined;

    return input.type;
  });

  return (
    <div
      className={`flex items-center justify-between gap-2 ${
        children ? "mb-3" : undefined
      }`}
    >
      <h2 className={labelClasses({}, ["m-0 block"])}>
        <InputDropdown
          currentType={inputType}
          inputPlugins={DecisionNode.inputPlugins.types}
          onSelect={(newType) => {
            if (inputType && inputId) {
              DecisionNode.inputPlugins.plugins[inputType].delete([inputId]);
            }

            const newInput = DecisionNode.inputPlugins.plugins[newType].create(
              {}
            );
            treeClient.pluginEntity.add("inputs", newInput);
            DecisionNode.updateInput(nodeId, newInput.id)(treeClient);
          }}
          alignByContent="left"
        />
      </h2>
      {children}
    </div>
  );
}
