import { labelClasses } from "@open-decision/design-system";
import { InputDropdown } from "@open-decision/plugins-node-helpers";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { TDecisionNodeInputs } from "../createInputPlugins";
import { DecisionNodePlugin } from "../DecisionNodePlugin";

const DecisionNode = new DecisionNodePlugin();

export type InputHeaderProps = {
  children?: React.ReactNode;
  inputId?: string;
  nodeId: string;
};

export function InputHeader({ children, inputId, nodeId }: InputHeaderProps) {
  const treeClient = useTreeClient();
  const inputType = useTree((treeClient) => {
    if (!inputId) return undefined;
    const input = treeClient.pluginEntity.get.single<TDecisionNodeInputs>(
      "inputs",
      inputId
    );

    if (input instanceof Error) return undefined;

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
          inputPlugins={DecisionNode.inputPlugins}
          onSelect={(newType) => {
            if (inputType && inputId) {
              DecisionNode.inputPlugins[inputType].plugin.delete([inputId]);
            }

            const newInput = DecisionNode.inputPlugins[newType].plugin.create(
              {}
            )(treeClient);
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
