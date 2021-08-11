import { MainContent } from "components";
import { NodeEditor } from "features";
import { TreeProvider } from "features/Builder/hooks/useTree";

export default function Tree(): JSX.Element {
  return (
    <MainContent css={{ overflow: "hidden" }}>
      <TreeProvider>
        <NodeEditor />
      </TreeProvider>
    </MainContent>
  );
}
