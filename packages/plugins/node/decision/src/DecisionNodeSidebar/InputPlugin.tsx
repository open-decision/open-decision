import { Stack } from "@open-decision/design-system";
import { sidebarCardClasses } from "@open-decision/node-editor";
import { useTree } from "@open-decision/tree-sync";
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

  const InputComponents = input
    ? DecisionNode.inputPlugins[input.type].BuilderComponent
    : null;

  const Header = ({ children }: { children?: React.ReactNode }) => (
    <InputHeader inputId={inputId} nodeId={nodeId}>
      {children}
    </InputHeader>
  );

  return (
    <section key={inputId} className={sidebarCardClasses}>
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
            <InputComponents.InputConfigurator inputId={inputId} />
          </>
        )}
      </Stack>
    </section>
  );
}
