import { labelClasses } from "@open-decision/design-system";
import { InputDropdown } from "@open-decision/plugins-node-helpers";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { DecisionNodePlugin } from "../decisionNodePlugin";

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
    return treeClient.pluginEntity.get.single<typeof DecisionNode.inputType>(
      "inputs",
      inputId
    ).type;
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
              DecisionNode.inputPlugins[inputType].plugin.deleteInput([
                inputId,
              ]);
            }

            const newInput = DecisionNode.inputPlugins[newType].plugin.create();
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
